'use client';

import { useEffect, useRef } from 'react';
import { Skeleton } from '@/components/ui/skeleton';
import { ErrorState } from '@/components/feedback/error-state';
import { DashboardHero } from '@/features/home/components/welcome-banner';
import { ProgressOverview } from '@/components/dashboard/ProgressOverview';
import { SubjectsOverview } from '@/components/dashboard/SubjectsOverview';
import { UpgradeBanner } from '@/components/dashboard/UpgradeBanner';
import { StatsSummary } from '@/features/home/components/stats-summary';
import { ModulesGrid } from '@/features/home/components/modules-grid';
import { useMeQuery } from '@/features/home/hooks/use-me-query';
import { useProgressQuery } from '@/features/progress/hooks/use-progress-query';
import { useIsPremium } from '@/features/paywall/hooks/use-is-premium';
import { useTrapBackNavigation } from '@/hooks/use-trap-back-navigation';
import { progress as defaultProgress, subjectsOverview as defaultSubjectsOverview } from '@/components/dashboard/progress-data';
import { track } from '@/services/analytics/analytics';
import { ANALYTICS_EVENTS } from '@/services/analytics/events';

function HomeSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-28 w-full rounded-2xl" />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 7 }).map((_, i) => (
          <Skeleton key={i} className="h-24 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}

export default function HomePage() {
  const { data: user, isLoading, isError, refetch, isSuccess } = useMeQuery();
  const { data: progressData } = useProgressQuery();
  const { isPremium } = useIsPremium();
  const profileFetchedTracked = useRef(false);

  useTrapBackNavigation();

  const progress = {
    ...defaultProgress,
    questionsSolved: user?.stats?.totalAttempts ?? defaultProgress.questionsSolved,
    accuracy: user?.stats?.accuracyPercent ?? defaultProgress.accuracy,
    mocksAttempted: progressData?.mocksAttempted ?? defaultProgress.mocksAttempted,
    totalMocks: progressData?.totalMocks ?? defaultProgress.totalMocks,
    locked: !isPremium,
  };

  const subjectsOverview = { ...defaultSubjectsOverview, locked: !isPremium };

  useEffect(() => {
    track(ANALYTICS_EVENTS.HOME_VIEWED);
  }, []);

  useEffect(() => {
    if (isSuccess && !profileFetchedTracked.current) {
      profileFetchedTracked.current = true;
      track(ANALYTICS_EVENTS.PROFILE_FETCHED);
    }
  }, [isSuccess]);

  if (isLoading) return <HomeSkeleton />;

  if (isError) {
    return (
      <ErrorState
        title="Couldn't load your dashboard"
        description="Check your connection and try again."
        onRetry={refetch}
      />
    );
  }

  return (
    <div className="space-y-6">
      <DashboardHero user={user} />
      <ProgressOverview progress={progress} />
      <SubjectsOverview data={subjectsOverview} />
      {!isPremium && <UpgradeBanner />}
      {/* <StatsSummary stats={user?.stats} />
      <div className="space-y-3">
        <h2 className="text-lg font-semibold">Jump back in</h2>
        <ModulesGrid />
      </div> */}
    </div>
  );
}
