"use client";

import { useEffect, useState } from "react";
import { Sparkles, TrendingUp, AlertCircle, Info, BrainCircuit } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, AnimatePresence } from "framer-motion";

export function AIAdvisor() {
  const [advice, setAdvice] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAdvice() {
      try {
        const res = await fetch("/api/ai/analyze");
        const data = await res.json();
        if (data.advice) {
          setAdvice(data.advice);
        }
      } catch (err) {
        console.error("Fetch AI advice error:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchAdvice();
  }, []);

  if (loading) {
    return (
      <Card className="border-primary/20 bg-primary/5 backdrop-blur-sm">
        <CardHeader className="pb-2">
          <CardTitle className="flex items-center gap-2 text-primary text-lg">
            <BrainCircuit className="h-5 w-5 animate-spin-slow" />
            Cố vấn AI Đang Phân Tích...
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-5 w-full animate-pulse rounded bg-primary/10" />
          ))}
        </CardContent>
      </Card>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="mt-6"
    >
      <Card className="overflow-hidden border-primary/30 bg-gradient-to-br from-indigo-500/10 via-background/80 to-purple-500/10 backdrop-blur-xl shadow-2xl relative">
        <div className="absolute top-0 right-0 p-4 opacity-10">
            <Sparkles className="h-24 w-24 text-primary" />
        </div>
        
        <CardHeader className="pb-4 border-b border-white/10">
          <CardTitle className="flex items-center gap-3 text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-400 text-2xl font-bold">
            <Sparkles className="h-7 w-7 text-yellow-500 fill-yellow-500/20" />
            Cố vấn Tài chính Thông minh (AI)
          </CardTitle>
        </CardHeader>
        
        <CardContent className="pt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <AnimatePresence>
            {advice.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 + index * 0.15 }}
                className="relative group p-4 rounded-xl border border-white/5 bg-white/5 hover:bg-white/10 hover:border-primary/50 transition-all duration-300"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${
                    index === 0 ? "bg-green-500/20 text-green-400" : 
                    index === 1 ? "bg-amber-500/20 text-amber-400" : 
                    "bg-blue-500/20 text-blue-400"
                  }`}>
                    {index === 0 ? <TrendingUp className="h-5 w-5" /> : 
                     index === 1 ? <AlertCircle className="h-5 w-5" /> : 
                     <Info className="h-5 w-5" />}
                  </div>
                  <span className="text-xs font-bold uppercase tracking-wider text-muted-foreground/70">
                    {index === 0 ? "Tăng trưởng" : index === 1 ? "Cảnh báo" : "Gợi ý"}
                  </span>
                </div>
                
                <p className="text-sm font-medium leading-relaxed text-foreground/90 group-hover:text-foreground transition-colors">
                  {item}
                </p>
                
                <div className="absolute -bottom-1 -right-1 h-8 w-8 bg-primary/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity" />
              </motion.div>
            ))}
          </AnimatePresence>
        </CardContent>
      </Card>
    </motion.div>
  );
}
