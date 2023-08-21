declare namespace Star {
  type StarBook = {
    id: number;
    name: string;
    count: number;
  }

  type StarBookBool = {
    id: number;
    name: string;
    count: number;
    isContain: boolean;
  }

  type StarBookQuery = {
    bookId: number;
    pageNum: number;
    pageSize: number;
  }
}
