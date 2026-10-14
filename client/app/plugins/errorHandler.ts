export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.config.errorHandler = (error, instance, info) => {
    console.error('Global error handler:', error)
    console.error('Error info:', info)
    console.error('Vue instance:', instance)
    
    // Send error to monitoring service in production
    if (process.env.NODE_ENV === 'production') {
      // Example: send to Sentry, LogRocket, etc.
      // Sentry.captureException(error)
    }
  }

  // Handle unhandled promise rejections
  if (process.client) {
    window.addEventListener('unhandledrejection', (event) => {
      console.error('Unhandled promise rejection:', event.reason)
      event.preventDefault()
    })
  }
})
