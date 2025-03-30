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
  query?: {
    keys: string[];
    value: string;
  };
  filters?: Filter[];
};

type Filter = { key: string; value: string };

const buildStrapiQuery = ({ query, pagination, filters = [] }: Params) => {
  const params = new URLSearchParams();

  if (pagination) {
    const { page, pageSize } = pagination;

    params.set("pagination[page]", String(page));
    params.set("pagination[pageSize]", String(pageSize));
  }

  if (query) {
    const { keys, value } = query;
    keys.forEach((key, index) =>
      params.append(`filters[$or][${index}][${key}][$containsi]`, value)
    );
  }

  filters.forEach(({ key, value }) => params.append(key, value));

  return params;
};

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("query") ?? "";
  const page = searchParams.get("page") ?? "1";
  const pageSize = searchParams.get("pageSize");
  const startDate = searchParams.get("startDate") ?? "";
  const endDate = searchParams.get("endDate") ?? "";

  const filters: Filter[] = [];

  if (startDate) {
    filters.push({
      key: "filters[createdAt][$gte]",
      value: startDate,
    });
  }

  if (endDate) {
    filters.push({
      key: "filters[createdAt][$lte]",
      value: endDate,
    });
  }

  const params = buildStrapiQuery({
    query: { keys: ["name"], value: query },
    pagination: {
      page: parseInt(page, 10),
      pageSize: pageSize ? parseInt(pageSize) : PAGE_SIZE,
    },
    filters,
  });

  const response = await fetch(
    `${API_ENDPOINT}/${DATA_ENTITIES.PRODUCTS}?${params.toString()}`
  );
  const data = await response.json();
  return NextResponse.json(data);
}
