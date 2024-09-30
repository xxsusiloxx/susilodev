import Login from "@/components/modules/Login";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function About() {
  return (
    <div className="w-full flex mx-auto max-w-sm">
      <section className="h-screen flex flex-col justify-center items-center mx-auto">
        <Card className="px-4 py-3 pb-1">
          <CardHeader>
            <CardTitle>Login Page</CardTitle>
            <CardDescription>
              Log in with your Google account for quick and easy access to our
              application.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Login />
          </CardContent>
          <CardFooter className="flex justify-end pt-6">
            <p className="text-center text-xs text-slate-500 flex justify-end items-end">
              Powered by Grabjob, inc
            </p>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
