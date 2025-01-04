export const signOut = async (
  dispatch,
  signOutStart,
  signOutFailure,
  signOutSuccess
) => {
  try {
    dispatch(signOutStart());
    const res = await fetch(`/api/auth/signout`, {
      method: "POST",
    });
    const data = await res.json();

    if (!res.ok) {
      dispatch(signOutFailure(data.message));
    } else {
      dispatch(signOutSuccess());
    }
  } catch (error) {
    dispatch(signOutFailure(error.message));
  }
};
