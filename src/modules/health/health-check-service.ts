export const healthCheckService = async () => {
  try {
    const response = {
      status: 'ok',
    }

    return {
      success: true,
      data: response,
      error: null,
    }
  } catch (error) {
    console.error('HEALTH_CHECK_SERVICE_ERROR', error)
    return {
      success: false,
      data: null,
      error:
        error instanceof Error
          ? 'Error checking server health'
          : 'Internal Server Error',
    }
  }
}
