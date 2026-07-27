/**
 * Google Consent Mode v2 defaults. Must render BEFORE the GTM loader so tags
 * start in the denied state until the visitor accepts via the ConsentBanner.
 * The saved choice is restored from localStorage on every page load.
 */
export function ConsentScript() {
  const js = `
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
window.gtag = window.gtag || gtag;
gtag('consent', 'default', {
  ad_storage: 'denied',
  ad_user_data: 'denied',
  ad_personalization: 'denied',
  analytics_storage: 'denied',
  wait_for_update: 500
});
try {
  if (localStorage.getItem('og_consent') === 'granted') {
    gtag('consent', 'update', {
      ad_storage: 'granted',
      ad_user_data: 'granted',
      ad_personalization: 'granted',
      analytics_storage: 'granted'
    });
  }
} catch (e) {}
`;
  return <script dangerouslySetInnerHTML={{ __html: js }} />;
}
