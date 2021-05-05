
interface GistDetails {
    gist_id: string;
    created_at: string;
    description: string;
    is_favorite: boolean;
    files: string[];
}

interface GistSummary {
    gist_id: string;
    created_at: string;
    description: string;
    is_favorite: boolean;
}

interface GitDetailsResponse {
    success: boolean;
    results: GistDetails;
    error: Error;
};

interface GitSummariesResponse {
    success: boolean;
    results: GistSummary[];
    error: Error;
};

interface GitFavoritesListResponse {
    success: boolean;
    results: string[];
    error: Error;
};

interface GitFavoritesResponse {
    success: boolean;
    error: Error;
};