import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-twitter-extraExtraLightGray">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-twitter-blue mb-2">Join X Clone Today</h1>
          <p className="text-twitter-darkGray">Create your account</p>
        </div>
        <SignUp />
      </div>
    </div>
  );
}
