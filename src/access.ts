/**
 * @see https://umijs.org/zh-CN/plugins/plugin-access
 * */
export default function access(initialState: { currentUser?: API.LoginUserVO } | undefined) {
  const { currentUser } = initialState ?? {};
  return {
    // 允许用户
    canUser: currentUser,
    // 允许用户并且要有admin权限
    canAdmin: currentUser && currentUser.userRole === 'admin',
  };
}
