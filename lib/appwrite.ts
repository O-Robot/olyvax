import { getGravatar, getHighResGoogleAvatar } from "@/constants";
import * as linking from "expo-linking";
import { openAuthSessionAsync } from "expo-web-browser";
import { Account, Client, OAuthProvider } from "react-native-appwrite";

export const config = {
  platform: "com.robot.olyvax",
  endpoint: process.env.EXPO_PUBLIC_APPWRITE_ENDPOINT,
  projectId: process.env.EXPO_PUBLIC_APPWRITE_PROJECT_ID,
};

export const client = new Client();
client
  .setEndpoint(config.endpoint!)
  .setProject(config.projectId!)
  .setPlatform(config.platform!);

export const account = new Account(client);

export async function login() {
  try {
    const redirectURI = linking.createURL("/");

    const response = await account.createOAuth2Token(
      OAuthProvider.Google,
      redirectURI,
    );

    if (!response) throw new Error("Failed to login");

    const browserResult = await openAuthSessionAsync(
      response.toString(),
      redirectURI,
    );

    if (browserResult.type !== "success")
      throw new Error("Authentication failed");

    const url = new URL(browserResult.url);
    const secret = url.searchParams.get("secret")?.toString();
    const userId = url.searchParams.get("userId")?.toString();

    if (!secret || !userId)
      throw new Error("Failed to retrieve authentication details");

    const session = await account.createSession({ userId, secret });

    if (!session) throw new Error("Failed to create session");

    try {
      const identities = await account.listIdentities();

      const googleIdentity = identities.identities.find(
        (identity) => identity.provider === "google",
      );

      if (googleIdentity?.providerAccessToken) {
        const res = await fetch(
          "https://www.googleapis.com/oauth2/v3/userinfo",
          {
            headers: {
              Authorization: `Bearer ${googleIdentity.providerAccessToken}`,
            },
          },
        );

        const data = await res.json();

        if (data?.picture) {
          const highResAvatar = getHighResGoogleAvatar(data.picture);
          await account.updatePrefs({
            avatar: highResAvatar,
          });
        }
      }
    } catch (avatarError) {
      console.log("Avatar fetch failed:", avatarError);
    }

    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}

export async function logout() {
  try {
    await account.deleteSession({ sessionId: "current" });
    return true;
  } catch (error) {
    console.log(error);
    return false;
  }
}
export async function getCurrentUser() {
  try {
    const response = await account.get();
    if (!response) throw new Error("Failed to retrieve user");

    let avatarUrl = null;

    if (response.prefs?.avatar) {
      avatarUrl = response.prefs.avatar;
    }

    if (!avatarUrl && response.email) {
      avatarUrl = getGravatar(response.email);
    }

    return {
      ...response,
      avatar: avatarUrl,
    };
  } catch (error) {
    console.log(error);
    return null;
  }
}
