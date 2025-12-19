# 史蒂夫的现实大冒险 - APK 打包指南

## 当前状态
✅ Web应用已成功构建到 `dist/` 目录
✅ Capacitor 已初始化
✅ Android 平台已添加到 `android/` 目录

## 快速打包选项

### 方案A：使用 Android Studio（推荐，界面友好）

1. **下载 Android Studio**
   - 访问: https://developer.android.com/studio
   - 安装完成后运行

2. **打开项目**
   - File → Open → 选择本项目的 `android/` 文件夹
   
3. **配置签名**（首次使用）
   - Build → Generate Signed Bundle/APK
   - 创建新密钥库或选择现有的
   
4. **构建APK**
   - Build → Build Bundle(s)/APK(s) → Build APK(s)
   - 稍等3-5分钟
   - APK 将在 `android/app/release/` 中生成

---

### 方案B：使用命令行（快速，需要JDK 11+）

当前你的 Java 版本是 1.8.0，需要升级：

```powershell
# 1. 升级 JDK 到 11+
# 下载: https://adoptium.net/
# 或使用 Chocolatey:
choco install openjdk11

# 2. 重启终端后，进入项目
cd "C:\Users\Morta\Downloads\史蒂夫的现实大冒险"

# 3. 同步Gradle
cd android
gradlew.bat --version

# 4. 构建发布APK
gradlew.bat assembleRelease

# 5. APK 位置
# app\build\outputs\apk\release\app-release.apk
```

---

### 方案C：使用在线打包服务（无需本地配置）

1. **PhoneGap Build**: https://build.phonegap.com/
   - 上传 dist 文件夹
   - 在线生成 APK

2. **Firebase App Distribution**
   - 上传 APK 用于测试

---

## 推荐步骤

**最简单**: 方案A（Android Studio）
1. 下载安装 Android Studio
2. File → Open → `android/`
3. Build → Build APK(s)
4. 完成！

---

## APK 在线测试

生成 APK 后，可以：
- 在真机上安装: `adb install app-release.apk`
- 上传到 https://www.apkpure.com 分享
- 上传到 Google Play 发布

---

## 常见问题

**Q: 生成 APK 需要多长时间？**
A: 首次 3-5 分钟（下载依赖），之后 1-2 分钟

**Q: APK 大小**
A: 约 50-80 MB（取决于优化）

**Q: 可以直接安装到手机吗？**
A: 可以！通过 USB 连接或扫描二维码

**Q: 可以发布到 Google Play 吗？**
A: 可以，但需要：
   - 注册 Google Play 开发者账户（$25 一次性费用）
   - 创建应用页面
   - 上传 APK 或 App Bundle

---

## 后续支持

- 如需修改应用，重新运行 `npm run build` 然后 `npx cap sync android`
- 更新后重新构建 APK 即可

祝你打包顺利！🎮
