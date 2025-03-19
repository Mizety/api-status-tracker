export async function checkIfCredsAreValid(apiUrl: string, apiKey: string) {
  try {
    const response = await fetch(`${apiUrl}/health/checkCreds`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
      },
    });

    if (!response.ok) {
      return false;
    }

    return true;
  } catch (error) {
    return false;
  }
}
