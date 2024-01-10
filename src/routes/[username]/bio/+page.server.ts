import type { PageServerLoad, Actions } from "./$types";
import { adminAuth, adminDB } from "$lib/server/admin";
import { error, fail } from "@sveltejs/kit";


export const load = (async ({ cookies }) => {

  const sessionCookie = cookies.get('__session');

  try {
      const decodedClaims = await adminAuth.verifySessionCookie(sessionCookie!);
      const userDoc = await adminDB.collection('users').doc(decodedClaims.uid).get();
      const userData = userDoc.data();

      return {
          bio: userData?.bio,
      }

  } catch (e) {
      console.log(e)
      // redirect(301, '/login');
      throw error(401, 'Unauthorized request!')
  }
}) satisfies PageServerLoad;

export const actions = {
    default: async ({ locals, request, params }) => {

      const uid = locals.userID;

      const data = await request.formData();
        console.log(uid);

      const userRef = adminDB.collection("users").doc(uid!);
      const { username } = (await userRef.get()).data()!;
      if (params.username !== username) {
        throw error(401, "That username does not belong to you");
      }

      const bioValue = data.get('bio');
      const bio = bioValue ? bioValue.toString() : '';

      if (bio.length > 500) {
        return fail(400, { problem: "Bio must be less than 260 characters" });
      }


      await userRef.update({
        bio,
      });
    },
  } satisfies Actions;
