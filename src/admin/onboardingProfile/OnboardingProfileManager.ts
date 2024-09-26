export default class OnboardingProfileManager {
  static capitalize = (string) => {
    return string ? string.charAt(0).toUpperCase() + string.slice(1) : ''
  }
}
