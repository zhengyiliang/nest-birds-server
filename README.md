# nest-birds-server

## 权限设计

### 超级管理员

一个系统只有一个超级管理员(`is me`)

- 系统管理
  - 用户管理
    - 查看用户列表
    - 搜索用户
    - 创建管理员/用户
    - 修改管理员/用户信息（头像/描述/邮箱/权限/账号状态）
    - 重置管理员/用户的密码
- 个人中心
  - 查看个人信息（名称/头像/描述/邮箱）
  - 修改个人信息（名称/头像/描述/邮箱）
  - 修改密码

### 管理员

- 系统管理
  - 用户管理
    - 查看用户列表
    - 搜索用户
    - 创建用户
    - 修改用户信息（头像/描述/邮箱/权限/账号状态）
    - 重置用户的密码
- 个人中心
  - 查看个人信息（名称/头像/描述/邮箱）
  - 修改个人信息（名称/头像/描述/邮箱）
  - 修改密码

### 用户（浏览者）

- 系统管理
  - 查看用户列表
  - 搜索用户
- 个人中心
  - 查看个人信息（名称/头像/描述/邮箱）
  - 修改个人信息（名称/头像/描述/邮箱）
  - 修改密码

### sys_user 用户表

### sys_role 角色表

### sys_menu 菜单表

## 涉及表结构

## 文件上传

ali-oss 阿里云 oss 对象存储

putStream 流式上传文件

```javascript
/**
 * filename: 文件路径 例: a/b/001.jpg
 * data: 文件流
 * size: 文件流大小
 */
client.putStream(filenurl, data, {
  contentLength: size,
});
```

- 超级管理员可以增删改查所有内容

- 管理员-及作者 - 增删改查（文章/标签/分类/评论）

- 浏览者-浏览系统-只能查看

- 方案 1：react 项目前台 qq 登录阉割-暂时不开发

  - 作者在后台系统能看到评论并回复

  - 提供昵称输入框

  - 优点：图省事

  - 缺点：主动评论者不能直观看到回复，评论的内容没有归属权

- 方案 2：前台-qq 登录只为了可以评论-留言

  - 与后台系统账号不通用-需要单独申请

  - 缺点：需要单独创建一个 qq 用户表与评论表关联

  - 优点：前台登录后可以看到自己的评论是否被回复了

- 方案 3：最佳实现-每个用户都有一个自己的前台和后台（太麻烦了）

最终决定：后台有权限管理即不同的作者操作自己文章/分类/标签，前台大家一起共用哈哈，可以考虑方案 2，缺陷：前台展示和后管系统毫无关联性

- 留言只能留给超级管理员
