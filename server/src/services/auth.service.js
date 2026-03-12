const supabase = require("../config/supabaseClient");

const signUp = async ({ email, password, firstName, lastName }) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { first_name: firstName, last_name: lastName },
    },
  });

  if (error) throw error;

  // Best-effort profile creation — auth user is already created above
  if (data.user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: data.user.id,
      email,
      first_name: firstName,
      last_name: lastName,
    });

    if (profileError) {
      console.warn(
        "[auth.service] Profile insert failed:",
        profileError.message,
      );
    }
  }

  return data;
};

const signIn = async ({ email, password }) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  if (error) throw error;
  return data;
};

const signOut = async (accessToken) => {
  // Use user's own client context to invalidate their session
  const { error } = await supabase.auth.admin.signOut(accessToken);
  if (error) throw error;
};

module.exports = { signUp, signIn, signOut };
