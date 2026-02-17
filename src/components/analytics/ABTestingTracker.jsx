import React, { useEffect } from 'react';
import { base44 } from '@/api/base44Client';

export default function ABTestingTracker({ userEmail, testName }) {
  useEffect(() => {
    const assignVariant = async () => {
      const variant = Math.random() > 0.5 ? 'A' : 'B';
      
      await base44.entities.ABTestVariant.create({
        test_name: testName,
        variant_name: variant,
        user_email: userEmail,
        assigned_date: new Date().toISOString(),
        converted: false
      });

      // Store variant in session
      sessionStorage.setItem(`ab_${testName}`, variant);
    };

    if (!sessionStorage.getItem(`ab_${testName}`)) {
      assignVariant();
    }
  }, [userEmail, testName]);

  return null;
}