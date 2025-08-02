import RepositoryFactory, {
  POST,
  SHORT,
  TAG,
  GITHUB,
  ANALYTICS_DATA,
  type Repositories,
} from "./RepositoryFactory";

/**
 * Provides centralized access to repositories
 * Eliminates the need for repeated RepositoryFactory[SYMBOL] patterns
 */
export const useRepositories = () => {
  return {
    post: RepositoryFactory[POST],
    short: RepositoryFactory[SHORT],
    tag: RepositoryFactory[TAG],
    github: RepositoryFactory[GITHUB],
    analyticsData: RepositoryFactory[ANALYTICS_DATA],
  } as const;
};

/**
 * Type-safe repository access for specific repository types
 */
export const useRepository = <T extends keyof Repositories>(
  key: T,
): Repositories[T] => {
  return RepositoryFactory[key];
};

export type RepositoryAccess = ReturnType<typeof useRepositories>;
