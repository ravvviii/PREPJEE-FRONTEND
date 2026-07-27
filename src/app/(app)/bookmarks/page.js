import { BookmarksPage } from '@/features/bookmarks/components/bookmarks-page';
import { PaywallGate } from '@/features/paywall/components/paywall-gate';
import { FEATURES } from '@/features/paywall/config/entitlement-policy';

export default function Page() {
  return (
    <PaywallGate
      feature={FEATURES.BOOKMARKS}
      source="bookmarks_page"
      title="Your personal revision library"
      description="Upgrade to Premium to save questions and build a focused revision collection."
    >
      <BookmarksPage />
    </PaywallGate>
  );
}
