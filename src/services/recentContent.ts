// Track recently used films and connections to avoid repetition

const RECENT_FILMS_KEY = 'filmections_recent_films';
const RECENT_CONNECTIONS_KEY = 'filmections_recent_connections';
const MAX_RECENT_GAMES = 5; // Track last 5 games

interface RecentGame {
  filmIds: number[];
  connections: string[];
  timestamp: number;
}

export class RecentContentService {
  // Get recent film IDs from last N games
  getRecentFilmIds(): Set<number> {
    const recent = this.getRecentGames();
    const filmIds = new Set<number>();

    recent.forEach(game => {
      game.filmIds.forEach(id => filmIds.add(id));
    });

    return filmIds;
  }

  // Get recent connections from last N games
  getRecentConnections(): Set<string> {
    const recent = this.getRecentGames();
    const connections = new Set<string>();

    recent.forEach(game => {
      game.connections.forEach(conn => connections.add(conn));
    });

    return connections;
  }

  // Save a completed game
  saveGame(filmIds: number[], connections: string[]): void {
    const recent = this.getRecentGames();

    // Add new game
    recent.unshift({
      filmIds,
      connections,
      timestamp: Date.now(),
    });

    // Keep only last N games
    const trimmed = recent.slice(0, MAX_RECENT_GAMES);

    try {
      localStorage.setItem(RECENT_FILMS_KEY, JSON.stringify(trimmed));
    } catch (error) {
      console.warn('Failed to save recent content:', error);
    }
  }

  // Clear all recent content
  clear(): void {
    try {
      localStorage.removeItem(RECENT_FILMS_KEY);
      localStorage.removeItem(RECENT_CONNECTIONS_KEY);
    } catch (error) {
      console.warn('Failed to clear recent content:', error);
    }
  }

  private getRecentGames(): RecentGame[] {
    try {
      const stored = localStorage.getItem(RECENT_FILMS_KEY);
      if (!stored) return [];

      return JSON.parse(stored);
    } catch (error) {
      console.warn('Failed to load recent content:', error);
      return [];
    }
  }
}

export const recentContentService = new RecentContentService();
