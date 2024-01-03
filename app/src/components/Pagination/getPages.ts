type Params = {
  /** 現在のページ */
  page: number;
  /** 総ページ数 */
  totalPage: number;
};

export type PageItem =
  | {
      /** ページ番号 */
      value: number;
      /** 現在のページかどうか */
      current: boolean;
      /**
       * ページの種類
       * - `page`: ページ
       * - `ellipsis`: 省略記号
       */
      type: "page";
    }
  | {
      type: "ellipsis";
    };

/**
 * ページネーションのページの一覧を省略して返す
 *
 * @example
 * 1 2 3 ... 10
 * 1 ... 4 5 6 ... 10
 * 1 ... 7 8 9 10
 */
export function getPages({ page, totalPage }: Params): PageItem[] {
  // 5ページ以下の場合は全て表示
  if (totalPage <= 5) {
    return Array.from({ length: totalPage }).map((_, i) => ({
      value: i + 1,
      current: i + 1 === page,
      type: "page" as const,
    }));
  }

  if (page === 1) {
    const left = [
      ...Array.from({ length: 3 }).map((_, i) => ({
        value: i + 1,
        current: i + 1 === page,
        type: "page" as const,
      })),
    ];

    return [
      ...left,
      { type: "ellipsis" },
      {
        value: totalPage,
        current: totalPage === page,
        type: "page" as const,
      },
    ];
  } else if (page === 2) {
    const center = [
      ...Array.from({ length: 3 }).map((_, i) => ({
        value: i + 2,
        current: i + 2 === page,
        type: "page" as const,
      })),
    ];

    return [
      {
        value: 1,
        current: false,
        type: "page" as const,
      },
      ...center,
      { type: "ellipsis" },
      {
        value: totalPage,
        current: totalPage === page,
        type: "page" as const,
      },
    ];
  } else if (page === 3) {
    const left = [
      ...Array.from({ length: 3 }).map((_, i) => ({
        value: i + page - 1,
        current: i + page - 1 === page,
        type: "page" as const,
      })),
    ];

    return [
      {
        value: 1,
        current: false,
        type: "page" as const,
      },
      ...left,
      { type: "ellipsis" },
      {
        value: totalPage,
        current: totalPage === page,
        type: "page" as const,
      },
    ];
  } else if (page === totalPage) {
    const right = [
      ...Array.from({ length: 3 }).map((_, i) => ({
        value: i + totalPage - 2,
        current: i + totalPage - 2 === page,
        type: "page" as const,
      })),
    ];

    return [
      {
        value: 1,
        current: 1 === page,
        type: "page" as const,
      },
      { type: "ellipsis" },
      ...right,
    ];
  } else if (page === totalPage - 1) {
    const right = [
      ...Array.from({ length: 3 }).map((_, i) => ({
        value: i + totalPage - 2,
        current: i + totalPage - 2 === page,
        type: "page" as const,
      })),
    ];

    return [
      {
        value: 1,
        current: 1 === page,
        type: "page" as const,
      },
      { type: "ellipsis" },
      ...right,
    ];
  } else if (page === totalPage - 2) {
    const right = [
      ...Array.from({ length: 3 }).map((_, i) => ({
        value: i + totalPage - 3,
        current: i + totalPage - 3 === page,
        type: "page" as const,
      })),
    ];

    return [
      {
        value: 1,
        current: false,
        type: "page" as const,
      },
      { type: "ellipsis" },
      ...right,
      {
        value: totalPage,
        current: false,
        type: "page" as const,
      },
    ];
  } else {
    const center = [
      ...Array.from({ length: 3 }).map((_, i) => ({
        value: i + page - 1,
        current: i + page - 1 === page,
        type: "page" as const,
      })),
    ];

    return [
      {
        value: 1,
        current: 1 === page,
        type: "page" as const,
      },
      { type: "ellipsis" },
      ...center,
      { type: "ellipsis" },
      {
        value: totalPage,
        current: totalPage === page,
        type: "page" as const,
      },
    ];
  }
}
