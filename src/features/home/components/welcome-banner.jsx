'use client';

import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { trimdisplayName } from '@/utils/miscellaneous';

function greeting() {
  const hour = new Date().getHours();

  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';

  return 'Good evening';
}

export function DashboardHero({ user }) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="flex flex-col gap-8 py-12 lg:flex-row lg:items-end lg:justify-between"
    >
      <div className="max-w-3xl">
        <h1 className="text-4xl font-bold leading-tight">
          {greeting()},{" "}
          <motion.span
            initial={{
              backgroundPosition: "0%",
            }}
            animate={{
              backgroundPosition: "100%",
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              repeatType: "mirror",
            }}
            style={{
              backgroundSize: "200%",
            }}
            className="bg-gradient-to-r from-red-500 to-yellow-500 bg-clip-text text-transparent"
          >
            {trimdisplayName(user?.name)}!
          </motion.span>
          <br />
          Let's get your baseline.
        </h1>

        <p className="mt-4 max-w-2xl text-base leading-8 text-muted-foreground">
          Start with one adaptive test. We'll analyse your performance and
          create a personalised study plan tailored to your JEE goals.
        </p>
      </div>

      <div className="flex gap-4">
        <Button size="lg">Start Test</Button>

        <Button variant="outline" size="lg">
          Browse Subjects
        </Button>
      </div>
    </motion.section>
  );
}