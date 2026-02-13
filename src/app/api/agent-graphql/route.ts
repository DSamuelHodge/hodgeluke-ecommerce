import { NextRequest, NextResponse } from 'next/server'

/**
 * Agent GraphQL Endpoint
 * 
 * This endpoint serves as a dedicated GraphQL interface for server-side agents.
 * It simply proxies requests to Payload's built-in GraphQL endpoint at `/api/graphql`.
 * 
 * Payload's GraphQL automatically:
 * - Generates schemas for all collections (Users, Pages, Categories, Media, etc.)
 * - Supports full introspection (__schema, __type queries)
 * - Handles authentication and access control
 * - Resolves relationships between collections
 * 
 * Why a separate endpoint?
 * - Allows for agent-specific middleware (rate limiting, logging, etc.) in the future
 * - Provides a dedicated, documented endpoint for programmatic access
 * - Can be extended with custom authentication/authorization if needed
 */

async function handleGraphQLRequest(request: NextRequest) {
    // Get the request body
    const body = await request.text()

    // Get the base URL from the request
    const baseUrl = new URL(request.url).origin

    // Forward the request to Payload's GraphQL endpoint
    const response = await fetch(`${baseUrl}/api/graphql`, {
        method: request.method,
        headers: {
            'Content-Type': 'application/json',
            // Forward relevant headers
            ...(request.headers.get('Authorization') && {
                'Authorization': request.headers.get('Authorization')!
            }),
        },
        body,
    })

    // Get the response data
    const data = await response.json()

    // Return the GraphQL response
    return NextResponse.json(data, {
        status: response.status,
        headers: {
            'Content-Type': 'application/json',
        },
    })
}

export async function GET(request: NextRequest) {
    return handleGraphQLRequest(request)
}

export async function POST(request: NextRequest) {
    return handleGraphQLRequest(request)
}
