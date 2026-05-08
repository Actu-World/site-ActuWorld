const BREVO_API_URL = "https://api.brevo.com/v3/contacts";

export interface SubscribeResult {
  success: boolean;
  alreadyExists?: boolean;
  error?: string;
}

export async function subscribeToNewsletter(
  email: string,
  language: "fr" | "en"
): Promise<SubscribeResult> {
  const apiKey = import.meta.env.VITE_BREVO_API_KEY;

  if (!apiKey) {
    console.error("VITE_BREVO_API_KEY is not set");
    return { success: false, error: "config" };
  }

  try {
    const response = await fetch(BREVO_API_URL, {
      method: "POST",
      headers: {
        "accept": "application/json",
        "content-type": "application/json",
        "api-key": apiKey,
      },
      body: JSON.stringify({
        email,
        attributes: { LANGUAGE: language },
        updateEnabled: false,
      }),
    });

    if (response.status === 201) {
      return { success: true };
    }

    if (response.status === 400) {
      const data = await response.json();
      if (data.code === "duplicate_parameter") {
        return { success: false, alreadyExists: true };
      }
      return { success: false, error: data.message };
    }

    return { success: false, error: `HTTP ${response.status}` };
  } catch {
    return { success: false, error: "network" };
  }
}
