//! The containing app's SMAppService bridge; product policy lives in TypeScript.
use std::path::PathBuf;

pub(super) fn library_path() -> Option<PathBuf> {
    let executable = std::env::current_exe().ok()?;
    let path = executable
        .parent()?
        .parent()?
        .join("Frameworks/libdshservice.dylib");
    if path.is_file() { Some(path) } else { None }
}

fn manage_service(operation: &str) -> Result<String, String> {
    if !["status", "register", "unregister"].contains(&operation) {
        return Err("不支持的服务操作".into());
    }
    // Keep Swift loaded in the real NSH process, preserving Bundle.main and identity.
    static LIBRARY: std::sync::OnceLock<Result<libloading::Library, String>> =
        std::sync::OnceLock::new();
    let library = LIBRARY
        .get_or_init(|| {
            let path = library_path().ok_or("当前构建没有系统服务组件")?;
            unsafe { libloading::Library::new(path) }.map_err(|_| "系统服务组件加载失败".into())
        })
        .as_ref()
        .map_err(Clone::clone)?;
    type Manage = unsafe extern "C" fn(*const libc::c_char) -> *mut libc::c_char;
    let function: libloading::Symbol<'_, Manage> =
        unsafe { library.get(b"dsh_manage_service\0") }.map_err(|_| "系统服务组件版本不兼容")?;
    let input = std::ffi::CString::new(operation).map_err(|_| "无效服务操作")?;
    let output = unsafe { function(input.as_ptr()) };
    if output.is_null() {
        return Err("系统服务状态读取失败".into());
    }
    let bytes = unsafe { std::ffi::CStr::from_ptr(output) }
        .to_bytes()
        .to_vec();
    unsafe { libc::free(output.cast()) };
    if bytes.len() > 16 * 1024 {
        return Err("系统服务响应过大".into());
    }
    String::from_utf8(bytes).map_err(|_| "无效系统服务响应".into())
}

pub(super) async fn manage(operation: String) -> Result<String, String> {
    tokio::task::spawn_blocking(move || manage_service(&operation))
        .await
        .map_err(|_| "系统服务任务中断".to_string())?
}
