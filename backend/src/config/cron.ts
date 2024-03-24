import { db } from '.';
import { otpDetails } from '../schema/userSchema';
import { gte } from 'drizzle-orm';
const CronJob = require('cron').CronJob;

async function deleteOtp() {
  try {
    console.log('Deleting OTP');
    await db.delete(otpDetails).where(gte(new Date() as any, otpDetails?.expiresAt));
  } catch (error) {
    console.error('Error deleting OTP:', error);
  }
}

export function initCronJob() {
  try {
    new CronJob(
      '*/5 * * * *',
      function () {
        deleteOtp();
      },
      null,
      true,
      'Asia/Kolkata'
    );
  } catch (error) {
    console.error('Error initializing cron job:', error);
  }
}
