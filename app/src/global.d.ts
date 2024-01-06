declare module "$env/static/private" {
  export const API_KEY: string;
  export const PREVIEW_API_KEY: string;
  export const SPACE: string;
  export const ENVIRONMENTS: string;
  export const GITHUB_TOKEN: string;
  export const PRIVATE_KEY: string;
  export const CLIENT_EMAIL: string;
  export const PROPERTY_ID: string;
}
declare module "$env/static/public" {
  export const PUBLIC_ANALYTICS_ID: string;
  export const PUBLIC_BASE_URL: string;
}

/**
 * @see https://pagefind.app/docs/ui/
 */
interface PagefindUIInterface {
  new (options: {
    /**
     * A selector for the HTML element to attach Pagefind UI to. This is the only required argument.
     */
    element: string;
    /**
     * The number of search results to load at once, before a “Load more” button is shown. Defaults to 5.
     */
    pageSize?: number;
    /**
     * Whether to show nested results for each heading within a matching page. Defaults to false. If true, a maximum of three will be shown per result.
     */
    showSubResults?: boolean;
    /**
     * Whether to show an image alongside each search result. Defaults to true.
     */
    showImages?: boolean;
    /**
     * Set the maximum length for generated excerpts. Defaults to 30, or 12 if showing sub results.
     */
    excerptLength?: number;
    /**
     * Provides a function that Pagefind UI calls before performing a search. This can be used to normalize search terms to match your content. The result will not be shown to the user, in the above example the search input would still display aa.
     */
    processTerm?: (term: string) => string;
    /**
     * Provides a function that Pagefind UI calls before displaying each result. This can be used to fix relative URLs, rewrite titles, or any other modifications you might like to make to the raw result object returned by Pagefind.
     */
    processResult?: (result: any) => any;
    /**
     * By default, Pagefind UI shows filters with no results alongside the count (0). Pass false to hide filters that have no remaining results.
     */
    showEmptyFilters?: boolean;
    /**
     * By default, Pagefind UI applies a CSS reset to itself. Pass false to omit this and inherit from your site styles.
     */
    resultStyles?: boolean;
    /**
     * Overrides the bundle directory. In most cases this should be automatically detected from the URL of pagefind-ui.js. Set this if search isn’t working and you are seeing a console warning that this path could not be detected.
     */
    bundlePath?: string;
    /**
     * The number of milliseconds to wait after a user stops typing before performing a search. Defaults to 300. If you wish to disable this, set to 0.
     */
    debounceTimeoutMs?: number;
    /**
     * A set of custom ui strings to use instead of the automatically detected language strings. See the translations/en.json file for all available keys and their initial values.
     *
     * The items in square brackets such as SEARCH_TERM will be substituted dynamically when the text is used.
     */
    translations?: Partial<{
      placeholder: string;
      clear_search: string;
      load_more: string;
      search_label: string;
      filters_label: string;
      zero_results: string;
      many_results: string;
      one_result: string;
      alt_search: string;
      search_suggestion: string;
      searching: string;
    }>;
    /**
     * Enabling autofocus automatically directs attention to the search input field for enhanced user convenience, particularly beneficial when the UI is loaded within a modal dialog. However, exercise caution, as using autofocus indiscriminately may pose potential accessibility challenges.
     */
    autofocus?: boolean;
    /**
     * Passes sort options to Pagefind for ranking. Note that using a sort will override all ranking by relevance.
     *
     * The object passed to this option must match the sort config for the JS API.
     */
    sort?: Record<string, "asc" | "desc">;
  });
}

declare const PagefindUI: PagefindUIInterface;
