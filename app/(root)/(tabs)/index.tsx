import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HomeScreen() {
  return (
    <SafeAreaView>
      <Link
        href={"/sign-in"}
        className="font-black font-rubikbold text-4xl text-red-500"
      >
        Welcome to Olyax
      </Link>
    </SafeAreaView>
  );
}
