require "json"

package = JSON.parse(File.read(File.join(__dir__, "package.json")))

Pod::Spec.new do |s|
  s.name           = "react-native-universal-sheet"
  s.version        = package["version"]
  s.summary        = package["description"]
  s.homepage       = "https://github.com/your-org/react-native-universal-sheet"
  s.license        = package["license"]
  s.authors        = { "react-native-universal-sheet contributors" => "" }
  s.platforms      = { :ios => "15.0" }
  s.source         = { :git => "https://github.com/your-org/react-native-universal-sheet.git", :tag => "#{s.version}" }

  s.source_files   = "ios/**/*.{h,m,mm,swift}"
  s.swift_version  = "5.0"
  s.requires_arc   = true

  s.dependency "React-Core"

  install_modules_dependencies(s) if respond_to?(:install_modules_dependencies, true)
end
