"use client";
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { signIn } from 'next-auth/react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { motion } from 'framer-motion';
// import { Github, Code2 } from 'lucide-react';
import { toast } from 'react-hot-toast';


const signupSchema = z.object({
    name: z.string().min(2, "Name is too short"),
    email: z.string().email("Invalid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    platforms: z.object({
      leetcode: z.string().optional(),
      codechef: z.string().optional(),
      codeforces: z.string().optional(),
      geeksforgeeks: z.string().optional(),
      hackerrank: z.string().optional()
    })
  });
  

export default function SignUp() {
    const router = useRouter() ;
   
  const [isLoading, setIsLoading] = useState(false);
  
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(signupSchema)
  });


const handleGoogleSignIn = async ()=>{
    try{
        const result = await signIn('google',{callbackUrl:'/profile'});
        if(result?.error)
        {
            toast.error('Failed to sign in with Google');
        }else{
            toast.success('Successflly signed in!');
        }
    }catch(error)
    {
        toast.error('An error Occured');
    }
}
  const onSubmit = async (data) => {
    setIsLoading(true);
    try {
      const res  = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      
      if (res.ok) {
        const result = await signIn('credentials',
            {
                email : data.email,
                password:data.password,
                redirect:false,
            }
        ) ;
        if(result?.error)
        {   
            toast.error('Failed to sign in');
        }else{
            toast.success('Successfully signed up!');
            router.push('/profile');
        }
      }else{
        const error = await res.json();
        toast.error(error.message || 'Failed to sign up');
      }
    } catch (error) {
      toast.error('An error occured ');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black text-white">
      <div className="container mx-auto px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-300 bg-clip-text text-transparent">
              Join CodeCracker
            </h1>
            <p className="mt-2 text-zinc-400">
              Connect your competitive programming profiles
            </p>
          </div>

          <div className="bg-black/40 backdrop-blur-sm border border-zinc-800 rounded-lg p-6 mb-6">
          <button
  onClick={handleGoogleSignIn} 
  className="w-full flex items-center justify-center gap-2 bg-white text-black rounded-md px-4 py-3 font-medium hover:bg-gray-100 transition-colors"
  disabled={isLoading}
>
  <svg className="w-5 h-5" viewBox="0 0 24 24">
    <path
      fill="currentColor"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="currentColor"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="currentColor"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="currentColor"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
  Continue with Google
</button>

          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-4">
              {[
                { name: 'leetcode', label: 'LeetCode Username', required: true },
                { name: 'codechef', label: 'CodeChef Username', required: true },
                { name: 'codeforces', label: 'CodeForces Username', required: true },
                { name: 'hackerrank', label: 'HackerRank Username (Optional)', required: false },
                { name: 'atcoder', label: 'AtCoder Username (Optional)', required: false },
              ].map((platform) => (
                <div key={platform.name}>
                  <label className="block text-sm font-medium text-zinc-300 mb-1">
                    {platform.label}
                  </label>
                  <input
                    {...register(platform.name)}
                    className="w-full px-4 py-2 bg-black/40 border border-zinc-800 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white"
                    required={platform.required}
                  />
                  {errors[platform.name] && (
                    <p className="mt-1 text-sm text-red-500">
                      {errors[platform.name].message}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-md px-4 py-3 font-medium transition-colors"
              disabled={isLoading}
            >
              {isLoading ? 'Setting up your profile...' : 'Complete Setup'}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
}