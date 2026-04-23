# Chapter 5

这是一个基于 `Next.js 15 + Prisma + PostgreSQL` 的全栈项目。

## 环境要求

- `Node.js` 24.x
- `pnpm` 10.x
- `PostgreSQL` 15+ 或任意可用的 PostgreSQL 实例

当前本地已验证版本：

```bash
node -v
# v24.14.1

pnpm -v
# 10.33.0
```

## 安装依赖

项目的 `postinstall` 会自动执行下面这些数据库相关脚本：

- `pnpm dbm`
- `pnpm dbs`
- `pnpm dbg`

所以如果你的数据库和环境变量还没准备好，直接 `pnpm install` 很可能会失败。

建议先这样安装依赖：

```bash
pnpm install --ignore-scripts
```

等数据库准备完成后，再手动执行 Prisma 命令。

## 安装 PostgreSQL

如果你本机还没有 PostgreSQL，可以按自己系统安装。

Ubuntu / Debian:

```bash
sudo apt update
sudo apt install postgresql postgresql-contrib
```

macOS:

```bash
brew install postgresql
brew services start postgresql
```

Docker:

```bash
docker run --name chapter5-postgres \
  -e POSTGRES_USER=postgres \
  -e POSTGRES_PASSWORD=postgres \
  -e POSTGRES_DB=chapter5 \
  -p 5432:5432 \
  -d postgres:16
```

## 创建数据库

如果你是本机安装的 PostgreSQL，可以创建一个本地数据库：

```bash
createdb -U postgres chapter5
```

或者使用 `psql`：

```sql
CREATE DATABASE chapter5;
```

## 配置环境变量

项目当前 Prisma 配置位于 [src/database/schema/schema.prisma](/home/curry/code/3r/ts-fullstack/chapter5/src/database/schema/schema.prisma:1)，数据库驱动是 `postgresql`。

在项目根目录创建 `.env`：

```bash
cp .env.example .env
```

然后按你的本地数据库修改连接串：

```env
DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/chapter5"
DIRECT_URL="postgresql://postgres:postgres@127.0.0.1:5432/chapter5"
```

说明：

- `DATABASE_URL` 给 Prisma Client 使用
- `DIRECT_URL` 给 Prisma 迁移等场景使用

## 初始化数据库

依赖安装完成、`.env` 配好后，执行：

```bash
pnpm dbm
pnpm dbs
pnpm dbg
```

它们分别表示：

- `pnpm dbm`: 执行 Prisma migration，不自动 seed
- `pnpm dbs`: 执行 seed，填充初始数据
- `pnpm dbg`: 生成 Prisma Client

如果你想一次性重置数据库再初始化，可以使用：

```bash
pnpm dbmrs
```

## 启动项目

完成上面的步骤后，运行：

```bash
pnpm dev
```

默认访问：

```text
http://localhost:3000
```

## 当前启动结论

本地已经验证过以下内容：

- `pnpm install --ignore-scripts` 可以成功安装依赖
- `pnpm dbg` 可以成功生成 Prisma Client
- `pnpm dev` 可以成功启动 Next.js 开发服务

需要你本地额外准备的是：

- PostgreSQL 服务
- 项目根目录 `.env`
- 可连接的数据库实例

## 常用命令

```bash
pnpm dev      # 启动开发服务器
pnpm build    # 构建生产包
pnpm start    # 启动生产环境服务

pnpm dbm      # 执行迁移
pnpm dbs      # 执行 seed
pnpm dbg      # 生成 Prisma Client
pnpm dbmrs    # 重置数据库并重新迁移、seed
pnpm dbo      # 打开 Prisma Studio
```
