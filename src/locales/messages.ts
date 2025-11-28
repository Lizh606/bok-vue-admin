const zhMessages = {
  localeNames: {
    zh: "中文",
    en: "英文"
  },
  common: {
    confirm: "确认",
    cancel: "取消",
    deleteSuccess: "删除成功",
    blog: "博客",
    postsUnit: "篇"
  },
  header: {
    actions: {
      createPost: "写文章"
    },
    theme: {
      light: "亮色模式",
      dark: "暗色模式",
      system: "跟随系统"
    },
    tooltips: {
      siteStats: "站点统计",
      commentManagement: "评论管理",
      visitWebsite: "访问网站"
    },
    dropdown: {
      profile: "个人设置",
      logout: "退出登录"
    },
    languageLabel: "语言"
  },
  menu: {
    title: "运维管理",
    welcomeBack: "欢迎回来 😇",
    items: {
      dashboard: "仪表盘",
      article: "博文管理",
      user: "用户管理"
    }
  },
  route: {
    dashboard: "仪表盘",
    user: "用户管理",
    role: "角色管理",
    article: "博文管理",
    list: "博文列表",
    edit: "博文编辑"
  },
  login: {
    title: "欢迎回来",
    description: "登录后开始您的博客运维",
    placeholder: {
      username: "用户名",
      password: "密码"
    },
    remember: "记住我",
    forgot: "忘记密码？",
    button: {
      login: "登录",
      guest: "游客访问"
    },
    validation: {
      username: "请输入用户名",
      password: "请输入密码"
    },
    message: {
      loginFailed: "登录失败"
    }
  },
  dashboard: {
    title: "仪表盘",
    statistics: {
      posts: "文章总数",
      views: "总阅读量",
      comments: "评论数",
      favorites: "收藏数"
    },
    charts: {
      categories: "文章分类",
      recentComments: "最新评论"
    },
    seriesName: "文章分类",
    chart: {
      postUnit: "篇"
    }
  },
  comment: {
    empty: "暂无评论",
    from: "来自："
  },
  post: {
    title: "文章管理",
    button: {
      add: "新增文章"
    },
    alert: {
      title: "访客提示",
      messageStart: "当前为游客访问模式，暂无查看编辑权限。您可以访问",
      linkText: "🔗博客",
      messageEnd: "查看已发布的文章。"
    },
    table: {
      index: "序号",
      title: "文章标题",
      author: "作者",
      category: "分类",
      tag: "标签",
      date: "发布日期",
      actions: "操作"
    },
    operations: {
      edit: "编辑",
      delete: "删除"
    },
    message: {
      deleteConfirm: "确定删除该博文吗？",
      deleteSuccess: "删除文章成功",
      unknownUser: "未知用户"
    },
    dialog: {
      deleteTitle: "删除文章"
    }
  },
  postEditor: {
    title: {
      edit: "编辑文章",
      create: "写文章"
    },
    buttons: {
      back: "返回",
      publish: "发布"
    },
    form: {
      title: {
        label: "文章标题",
        placeholder: "请输入文章标题"
      },
      category: {
        label: "文章分类",
        placeholder: "请选择或输入文章分类"
      },
      date: {
        label: "发布日期",
        placeholder: "选择发布日期"
      },
      tags: {
        label: "文章标签",
        placeholder: "请选择或输入文章标签"
      },
      description: {
        label: "文章描述",
        placeholder: "请输入文章描述"
      },
      content: {
        label: "文章内容"
      }
    },
    rules: {
      titleRequired: "请输入文章标题",
      titleLength: "标题长度在 2 到 100 个字符",
      category: "请选择文章分类",
      tags: "请选择文章标签",
      content: "请输入文章内容",
      date: "请选择发布日期",
      description: "请输入文章描述",
      descriptionMax: "描述最多200个字符"
    },
    options: {
      categories: {
        frontend: "前端开发",
        backend: "后端开发",
        devops: "DevOps"
      }
    },
    message: {
      fetchDetailFailed: "获取文章详情失败",
      updateSuccess: "文章更新成功",
      publishSuccess: "文章发布成功",
      operationFailed: "操作失败"
    }
  },
  user: {
    title: "用户管理",
    button: {
      add: "新增用户"
    },
    alert: {
      title: "访客提示",
      content: "当前为游客访问模式，暂无编辑权限。"
    },
    table: {
      id: "ID",
      avatar: "头像",
      username: "用户名",
      nickname: "昵称",
      role: "角色",
      status: "状态",
      lastLogin: "最后登录时间",
      createdAt: "创建时间",
      actions: "操作"
    },
    operations: {
      edit: "编辑",
      delete: "删除"
    },
    dialog: {
      add: "新建用户",
      edit: "编辑用户",
      deleteTitle: "删除用户",
      deleteContent: "确定删除该用户吗？",
      confirmAdd: "确认添加",
      confirmEdit: "确认修改"
    },
    message: {
      deleteSuccess: "删除成功",
      addSuccess: "添加用户成功",
      updateSuccess: "更新用户成功",
      operationFail: "操作失败",
      statusSuccess: "更新状态成功",
      statusFail: "更新状态失败"
    }
  },
  userForm: {
    label: {
      username: "用户名",
      loginName: "昵称",
      password: "密码",
      roles: "角色",
      gender: "性别",
      phone: "联系方式",
      address: "地址",
      avatar: "头像"
    },
    placeholder: {
      password: "请输入密码",
      roles: "请选择角色",
      phone: "请输入联系方式",
      address: "请输入地址",
      avatar: "请输入头像链接"
    },
    gender: {
      male: "男",
      female: "女"
    },
    validation: {
      username: "请输入用户名",
      password: "请输入密码",
      loginName: "请输入昵称",
      roles: "请选择角色"
    },
    message: {
      loadRolesFailed: "获取角色列表失败",
      imageLoadFailed: "加载失败"
    }
  }
}

const enMessages: typeof zhMessages = {
  localeNames: {
    zh: "Chinese",
    en: "English"
  },
  common: {
    confirm: "Confirm",
    cancel: "Cancel",
    deleteSuccess: "Deleted successfully",
    blog: "blog",
    postsUnit: "posts"
  },
  header: {
    actions: {
      createPost: "New Post"
    },
    theme: {
      light: "Light Mode",
      dark: "Dark Mode",
      system: "Follow System"
    },
    tooltips: {
      siteStats: "Site stats",
      commentManagement: "Comment management",
      visitWebsite: "Visit website"
    },
    dropdown: {
      profile: "Profile",
      logout: "Log out"
    },
    languageLabel: "Language"
  },
  menu: {
    title: "Ops Console",
    welcomeBack: "Welcome back 😇",
    items: {
      dashboard: "Dashboard",
      article: "Post Management",
      user: "User Management"
    }
  },
  route: {
    dashboard: "Dashboard",
    user: "User Management",
    role: "Role Management",
    article: "Post Management",
    list: "Post List",
    edit: "Post Editor"
  },
  login: {
    title: "Welcome Back",
    description: "Log in to manage your blog",
    placeholder: {
      username: "Username",
      password: "Password"
    },
    remember: "Remember me",
    forgot: "Forgot password?",
    button: {
      login: "Log in",
      guest: "Visit as Guest"
    },
    validation: {
      username: "Please enter username",
      password: "Please enter password"
    },
    message: {
      loginFailed: "Login failed"
    }
  },
  dashboard: {
    title: "Dashboard",
    statistics: {
      posts: "Total posts",
      views: "Total views",
      comments: "Comments",
      favorites: "Favorites"
    },
    charts: {
      categories: "Post categories",
      recentComments: "Recent comments"
    },
    seriesName: "Post categories",
    chart: {
      postUnit: "posts"
    }
  },
  comment: {
    empty: "No comments yet",
    from: "From:"
  },
  post: {
    title: "Post Management",
    button: {
      add: "New Post"
    },
    alert: {
      title: "Guest Mode",
      messageStart:
        "You are visiting as a guest and cannot edit. You can visit the",
      linkText: "🔗blog",
      messageEnd: "to read published articles."
    },
    table: {
      index: "Index",
      title: "Title",
      author: "Author",
      category: "Category",
      tag: "Tag",
      date: "Published",
      actions: "Actions"
    },
    operations: {
      edit: "Edit",
      delete: "Delete"
    },
    message: {
      deleteConfirm: "Are you sure you want to delete this post?",
      deleteSuccess: "Post deleted",
      unknownUser: "Unknown user"
    },
    dialog: {
      deleteTitle: "Delete post"
    }
  },
  postEditor: {
    title: {
      edit: "Edit article",
      create: "Write article"
    },
    buttons: {
      back: "Back",
      publish: "Publish"
    },
    form: {
      title: {
        label: "Title",
        placeholder: "Enter title"
      },
      category: {
        label: "Category",
        placeholder: "Select or type category"
      },
      date: {
        label: "Publish date",
        placeholder: "Choose date"
      },
      tags: {
        label: "Tags",
        placeholder: "Select or type tags"
      },
      description: {
        label: "Description",
        placeholder: "Enter description"
      },
      content: {
        label: "Content"
      }
    },
    rules: {
      titleRequired: "Please enter a title",
      titleLength: "Title length must be between 2 and 100 characters",
      category: "Please select a category",
      tags: "Please select at least one tag",
      content: "Please enter article content",
      date: "Please select a publish date",
      description: "Please enter a description",
      descriptionMax: "Description can be at most 200 characters"
    },
    options: {
      categories: {
        frontend: "Frontend Development",
        backend: "Backend Development",
        devops: "DevOps"
      }
    },
    message: {
      fetchDetailFailed: "Failed to fetch post detail",
      updateSuccess: "Post updated",
      publishSuccess: "Post published",
      operationFailed: "Operation failed"
    }
  },
  user: {
    title: "User Management",
    button: {
      add: "Add User"
    },
    alert: {
      title: "Guest Mode",
      content: "You are visiting as a guest and cannot edit."
    },
    table: {
      id: "ID",
      avatar: "Avatar",
      username: "Username",
      nickname: "Nickname",
      role: "Role",
      status: "Status",
      lastLogin: "Last login",
      createdAt: "Created at",
      actions: "Actions"
    },
    operations: {
      edit: "Edit",
      delete: "Delete"
    },
    dialog: {
      add: "Create user",
      edit: "Edit user",
      deleteTitle: "Delete user",
      deleteContent: "Are you sure you want to delete this user?",
      confirmAdd: "Confirm add",
      confirmEdit: "Confirm edit"
    },
    message: {
      deleteSuccess: "Deleted successfully",
      addSuccess: "User added",
      updateSuccess: "User updated",
      operationFail: "Operation failed",
      statusSuccess: "Status updated",
      statusFail: "Failed to update status"
    }
  },
  userForm: {
    label: {
      username: "Username",
      loginName: "Nickname",
      password: "Password",
      roles: "Roles",
      gender: "Gender",
      phone: "Phone",
      address: "Address",
      avatar: "Avatar"
    },
    placeholder: {
      password: "Enter password",
      roles: "Select roles",
      phone: "Enter contact",
      address: "Enter address",
      avatar: "Enter avatar URL"
    },
    gender: {
      male: "Male",
      female: "Female"
    },
    validation: {
      username: "Please enter username",
      password: "Please enter password",
      loginName: "Please enter nickname",
      roles: "Please select roles"
    },
    message: {
      loadRolesFailed: "Failed to load roles",
      imageLoadFailed: "Loading failed"
    }
  }
}

export const supportedLocales = ["zh", "en"] as const
export type LocaleCode = (typeof supportedLocales)[number]
export const DEFAULT_LOCALE: LocaleCode = supportedLocales[0]
export type MessageSchema = typeof zhMessages
export const messages: Record<LocaleCode, MessageSchema> = {
  zh: zhMessages,
  en: enMessages
}
