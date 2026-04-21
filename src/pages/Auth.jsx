import { useState } from "react";
import { ConstellationBackground } from "@/components/ConstellationBackground";
import { Mail, Lock, User, ArrowRight, Loader2, Eye, EyeOff } from "lucide-react";
import { auth } from "@/lib/firebase";
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut, sendPasswordResetEmail } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export function Auth() {
  const { toast } = useToast();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast({
        variant: "destructive",
        title: "Missing Email",
        description: "Please enter your email address to receive a recovery link.",
      });
      return;
    }

    setIsLoading(true);
    try {
      await sendPasswordResetEmail(auth, email);
      toast({
        title: "Recovery Link Sent!",
        description: "Instructions to reset your access key have been dispatched to your inbox.",
      });
    } catch (error) {
      let description = error.message.replace("Firebase: ", "");
      if (error.code === "auth/user-not-found") {
        description = "No account detected with this email address.";
      }
      toast({
        variant: "destructive",
        title: "Recovery Failed",
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        const username = userCredential.user.displayName || "Explorer";
        toast({
          title: `Welcome, ${username}!`,
          description: "Neural link established successfully.",
        });
      } else {
        // Set a flag to prevent App.jsx from flickering to the dashboard
        localStorage.setItem('learnos_signup_in_progress', 'true');
        
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(userCredential.user, {
          displayName: name
        });
        
        // Sign out immediately so they have to log in manually as requested
        await signOut(auth);
        
        // Clear flag after signing out
        localStorage.removeItem('learnos_signup_in_progress');
        
        setIsLogin(true);
        setPassword(""); // Clear password for security
        
        toast({
          title: "Account secured!",
          description: "Your digital brain is ready. Please login to enter.",
        });
      }
    } catch (error) {
      // Clear signup flag if something went wrong
      localStorage.removeItem('learnos_signup_in_progress');
      
      let title = "Authentication Error";
      let description = error.message.replace("Firebase: ", "");
      
      if (isLogin && (error.code === "auth/user-not-found" || error.code === "auth/invalid-credential")) {
        title = "Neural Link Failed";
        description = "Account not detected in the database. Did you forget to sign up?";
      }

      toast({
        variant: "destructive",
        title: title,
        description: description,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen text-foreground relative flex items-center justify-center p-4">
      <ConstellationBackground />
      
      <div className="relative z-10 w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-background/50 p-3 sm:p-4 rounded-full border border-primary/20 shadow-glow mb-6 backdrop-blur-md">
            <img src="/Smart_Study_Hub/AuthLogo.png" alt="LearnOS Logo" className="w-32 h-32 sm:w-48 sm:h-48 object-contain rounded-full" />
          </div>
          <h1 className="text-3xl sm:text-4xl font-display font-bold text-primary cyan-glow-text mb-2">LearnOS</h1>
          <p className="text-sm text-muted-foreground font-mono mb-4 text-center">
            {isLogin 
              ? "Initializing synchronization protocols..." 
              : "Registering new consciousness in the database..."}
          </p>
        </div>

        <div className="glass-panel rounded-xl p-6 sm:p-8 shadow-2xl border border-primary/20 bg-background/80 backdrop-blur-xl">
          <div className="flex bg-background/50 p-1 rounded-lg mb-8 border border-border/50">
            <button
              type="button"
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${isLogin ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 text-sm font-medium rounded-md transition-all ${!isLogin ? 'bg-primary/20 text-primary shadow-sm' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required={!isLogin}
                    disabled={isLoading}
                    className="w-full pl-10 pr-3 py-2.5 bg-background/50 border border-border/50 rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                  />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  disabled={isLoading}
                  className="w-full pl-10 pr-3 py-2.5 bg-background/50 border border-border/50 rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider mb-1.5 block">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  disabled={isLoading}
                  style={{ colorScheme: "dark" }}
                  className="w-full pl-10 pr-10 py-2.5 bg-background/50 border border-border/50 rounded-md text-sm text-foreground placeholder:text-muted-foreground/50 outline-none focus:border-primary/50 transition-colors disabled:opacity-50 [&::-ms-reveal]:hidden [&::-webkit-reveal]:hidden"
                />
                {password.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-white hover:text-white/80 transition-colors focus:outline-none animate-in fade-in zoom-in duration-200"
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                )}
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-3 bg-primary text-primary-foreground text-sm font-semibold rounded-md hover:bg-primary/90 transition-colors mt-6 shadow-glow disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <>
                  {isLogin ? 'Login' : 'Create Account'}
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
          
          {isLogin && (
            <div className="mt-6 text-center animate-in fade-in duration-500">
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={isLoading}
                className="text-xs text-primary/80 hover:text-primary transition-colors font-mono hover:underline disabled:opacity-50 disabled:no-underline"
              >
                Lost your access key? (Forgot password)
              </button>
            </div>
          )}
          
          <div className="mt-8 pt-6 border-t border-border/30 text-center">
            <p className="text-[10px] text-muted-foreground font-mono uppercase tracking-[0.2em]">
              {isLogin 
                ? "Identity verification required for uplink." 
                : "Your data remains encrypted and decentralized."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
