export const getAllComments = async (postId, setComments) => {
  const res = await fetch(`${getBackendUrl()}/api/comment/post/${postId}`);
  const data = await res.json();
  console.log(data, "data---");
  if (res.ok) {
    setComments(data);
  }
};
