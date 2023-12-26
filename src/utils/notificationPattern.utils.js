export const notificationPattern = (notiType, userName) => {
  if (notiType === "comment") {
    return { message: `${userName} Commented on your Blog.` };
  } else if (notiType === "like") {
    return { message: `${userName} Liked on your Blog` };
  } else if (notiType === "follow") {
    return { message: `${userName} starting following you.` };
  } else {
    return null;
  }
};
