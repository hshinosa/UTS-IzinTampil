// Import library yang diperlukan
import { render, screen } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Home from './page' // Import komponen halaman utama Anda

// Import jest-dom matcher types
import '@testing-library/jest-dom'

// Mock fetch globally untuk API calls
const mockFetch = jest.fn()
global.fetch = mockFetch

// Buat QueryClient baru untuk setiap test
const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
})

// Mock data untuk todos
const mockTodos = [
  {
    id: 1,
    title: 'High Priority Task',
    description: 'Important task for Sprint 3',
    completed: false,
    priority: 'HIGH',
    createdAt: new Date('2025-11-09T10:00:00.000Z').toISOString(),
    updatedAt: new Date('2025-11-09T10:00:00.000Z').toISOString(),
  },
  {
    id: 2, 
    title: 'Medium Priority Task',
    description: 'Regular task', 
    completed: true,
    priority: 'MEDIUM',
    createdAt: new Date('2025-11-09T09:05:00.000Z').toISOString(),
    updatedAt: new Date('2025-11-09T09:05:00.000Z').toISOString(),
  },
  {
    id: 3,
    title: 'Low Priority Task',
    description: 'Low priority task',
    completed: false,
    priority: 'LOW',
    createdAt: new Date('2025-11-09T08:00:00.000Z').toISOString(),
    updatedAt: new Date('2025-11-09T08:00:00.000Z').toISOString(),
  }
]

// Mock API response
const mockApiResponse = {
  data: mockTodos,
  pagination: {
    page: 1,
    limit: 10,
    total: 3,
    pages: 1,
    hasNext: false,
    hasPrev: false,
  },
}

// 'describe' mengelompokkan tes
describe('Home Page', () => {
  let queryClient: QueryClient

  // Setup sebelum setiap test
  beforeEach(() => {
    queryClient = createQueryClient()
    // Mock fetch response
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => mockApiResponse,
    })
  })

  // Cleanup setelah setiap test
  afterEach(() => {
    jest.clearAllMocks()
  })

  // 'it' adalah satu skenario tes
  it('should render the todo list heading', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    )

    // Tunggu heading selesai load
    const headings = await screen.findAllByRole('heading', {
      name: /todo list/i,
    })
    
    // Harus ada 2 headings: satu di Statistics, satu di TodoList
    expect(headings).toHaveLength(2)
    
    // Verifikasi TodoList heading ada (ke-2 atau yang terakhir)
    expect(headings[1]).toBeInTheDocument()
  })

  it('should render todo items in the list', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    )

    // Tunggu todo items muncul
    await screen.findByText(/High Priority Task/i)
    
    // Cari beberapa todo items
    const firstTodo = screen.getByText(/High Priority Task/i)
    const secondTodo = screen.getByText(/Medium Priority Task/i)
    
    expect(firstTodo).toBeInTheDocument()
    expect(secondTodo).toBeInTheDocument()
  })

  it('should render filters section', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    )

    // Tunggu TodoLoaded selesai (bukan skeleton)
    await screen.findByRole('heading', { name: /Low Priority Task/i })
    
    // Cari filter elements
    const searchInput = screen.getByPlaceholderText('Search todos...')
    const priorityFilter = screen.getByLabelText('Priority')
    const statusFilter = screen.getByLabelText('Status')
    
    // Pastikan filter elements ada (bahkan skeleton)
    expect(searchInput).toBeInTheDocument()
    expect(priorityFilter).toBeInTheDocument()
    expect(statusFilter).toBeInTheDocument()
  })

  it('should render navbar', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    )

    // Cari navbar
    const navbar = screen.getByRole('navigation')
    expect(navbar).toBeInTheDocument()
  })

  it('should render statistics section', async () => {
    render(
      <QueryClientProvider client={queryClient}>
        <Home />
      </QueryClientProvider>
    )

    // Tunggu Statistics section selesai load
    await screen.findByText(/Data Statistik Todo List/i)
    
    const statsElement = screen.getByText(/Data Statistik Todo List/i)
    expect(statsElement).toBeInTheDocument()
  })
})
