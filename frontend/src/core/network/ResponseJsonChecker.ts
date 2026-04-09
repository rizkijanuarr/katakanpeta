export const checkResponseJson = async <T>(response: Response): Promise<T> => {
    try {
        const json: T = await response.json();
        return json;
    } catch (error) {
        const errorMessage =
            error instanceof Error ? error.message : 'Unknown error';
        console.error('Company Name', `error: ${JSON.stringify(errorMessage)}`);
        throw new Error(errorMessage);
    }
};