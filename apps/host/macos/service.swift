import Foundation
import ServiceManagement

// Loaded into the NSH app process, so Bundle.main and the signing identity
// belong to the actual containing app rather than a second CLI executable.
final class UnregisterResult: @unchecked Sendable {
    let condition = NSCondition()
    var done = false
    var error: Error?
}

@available(macOS 13.0, *)
func manage(_ operation: String) throws -> [String: String] {
    let name = "dev.dsh-bot.host.plist"
    let service = SMAppService.agent(plistName: name)
    func status() -> String {
        switch service.status {
        case .notRegistered: return "notRegistered"
        case .enabled: return "enabled"
        case .requiresApproval: return "requiresApproval"
        case .notFound: return "notFound"
        @unknown default: return "unknown"
        }
    }
    switch operation {
    case "status": break
    case "register":
        if service.status != .enabled && service.status != .requiresApproval { try service.register() }
    case "unregister":
        if service.status != .notRegistered {
            let result = UnregisterResult()
            service.unregister { error in
                result.condition.lock()
                result.error = error
                result.done = true
                result.condition.broadcast()
                result.condition.unlock()
            }
            result.condition.lock()
            defer { result.condition.unlock() }
            let deadline = Date().addingTimeInterval(15)
            while !result.done {
                if !result.condition.wait(until: deadline) {
                    throw NSError(domain: "DSHService", code: 4, userInfo: [NSLocalizedDescriptionKey: "后台服务退出尚未确认，请稍后重新检查系统后台项目"])
                }
            }
            if let error = result.error { throw error }
        }
    default: throw NSError(domain: "DSHService", code: 2, userInfo: [NSLocalizedDescriptionKey: "不支持的服务操作"])
    }
    return ["status": status()]
}
@_cdecl("dsh_manage_service")
public func dshManageService(_ input: UnsafePointer<CChar>) -> UnsafeMutablePointer<CChar>? {
    let result: [String: String]
    do {
        if #available(macOS 13.0, *) { result = try manage(String(cString: input)) }
        else { result = ["status": "unsupported"] }
    } catch { result = ["status": "error", "error": error.localizedDescription] }
    guard let data = try? JSONSerialization.data(withJSONObject: result, options: [.sortedKeys]), let text = String(data: data, encoding: .utf8) else { return nil }
    return strdup(text)
}
