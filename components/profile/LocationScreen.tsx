import React from 'react';
import PageScrollView from '../ui/PageScrollView';
import LocationPreferences from './user-preferences/LocationPreferences';

export default function LocationScreen() {
  // const router = useRouter();
  // const segments = useSegments();
  // useEffect(() => {
  //   if (segments.includes('profile')) {
  //     router.push('/profile/location-preferences');
  //   }
  // }, []);
  return (
    <PageScrollView>
      <LocationPreferences />
    </PageScrollView>
  );
}
