import { type NextRequest, NextResponse } from "next/server";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

const DATA_ENTITIES = {
  PRODUCTS: "products",
};

const PAGE_SIZE = 10;

type Params = {
  pagination?: {
    page: number;
    pageSize: number;
  };
  filters?: {
    keys: string[];
    query: string;
  };
};

const buildStrapiQuery = ({ filters, pagination }: Params) => {
  const params = new URLSearchParams();

  if (pagination) {
    const { page, pageSize } = pagination;

    params.set("pagination[page]", String(page));
    params.set("pagination[pageSize]", String(pageSize));
  }

  if (filters) {
    const { keys, query } = filters;
    keys.forEach((key, index) =>
      params.append(`filters[$or][${index}][${key}][$containsi]`, query)
    );
  }

  return params;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") ?? "";
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize");

  const params = buildStrapiQuery({
    filters: { keys: ["name"], query },
    pagination: {
      page: parseInt(page, 10),
      pageSize: pageSize ? parseInt(pageSize) : PAGE_SIZE,
    },
  });

  const response = await fetch(
    `${API_ENDPOINT}/${DATA_ENTITIES.PRODUCTS}?${params.toString()}`
  );
  const data = await response.json();
  return NextResponse.json(data);
}
