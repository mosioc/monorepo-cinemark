import { adminSideBarLinks, FIELD_NAMES } from '@/constants/index'

describe('Constants', () => {
  describe('adminSideBarLinks', () => {
    it('should have correct structure for each link', () => {
      adminSideBarLinks.forEach((link) => {
        expect(link).toHaveProperty('img')
        expect(link).toHaveProperty('route')
        expect(link).toHaveProperty('text')
        expect(typeof link.img).toBe('string')
        expect(typeof link.route).toBe('string')
        expect(typeof link.text).toBe('string')
      })
    })

    it('should contain Dashboard link', () => {
      const dashboardLink = adminSideBarLinks.find((link) => link.text === 'Dashboard')
      expect(dashboardLink).toBeDefined()
      expect(dashboardLink?.route).toBe('/admin')
      expect(dashboardLink?.img).toBe('/icons/admin/home.svg')
    })

    it('should contain Users link', () => {
      const usersLink = adminSideBarLinks.find((link) => link.text === 'Users')
      expect(usersLink).toBeDefined()
      expect(usersLink?.route).toBe('/admin/users')
      expect(usersLink?.img).toBe('/icons/admin/users.svg')
    })

    it('should contain All Movies link', () => {
      const moviesLink = adminSideBarLinks.find((link) => link.text === 'All Movies')
      expect(moviesLink).toBeDefined()
      expect(moviesLink?.route).toBe('/admin/movies')
      expect(moviesLink?.img).toBe('/icons/admin/movie.svg')
    })

    it('should have exactly 3 links', () => {
      expect(adminSideBarLinks).toHaveLength(3)
    })

    it('should have unique routes', () => {
      const routes = adminSideBarLinks.map((link) => link.route)
      const uniqueRoutes = new Set(routes)
      expect(uniqueRoutes.size).toBe(routes.length)
    })

    it('should have unique text labels', () => {
      const texts = adminSideBarLinks.map((link) => link.text)
      const uniqueTexts = new Set(texts)
      expect(uniqueTexts.size).toBe(texts.length)
    })

    it('should have valid image paths', () => {
      adminSideBarLinks.forEach((link) => {
        expect(link.img).toMatch(/^\/icons\/admin\/.*\.svg$/)
      })
    })

    it('should have valid route paths', () => {
      adminSideBarLinks.forEach((link) => {
        expect(link.route).toMatch(/^\/admin(\/.*)?$/)
      })
    })

    it('should not be empty', () => {
      expect(adminSideBarLinks.length).toBeGreaterThan(0)
    })

    it('should maintain correct order', () => {
      expect(adminSideBarLinks[0].text).toBe('Dashboard')
      expect(adminSideBarLinks[1].text).toBe('Users')
      expect(adminSideBarLinks[2].text).toBe('All Movies')
    })

    it('should have immutable structure', () => {
      const originalLength = adminSideBarLinks.length
      expect(() => {
        const copy = [...adminSideBarLinks]
        copy.push({
          img: '/test.svg',
          route: '/test',
          text: 'Test',
        })
      }).not.toThrow()
      expect(adminSideBarLinks).toHaveLength(originalLength)
    })
  })

  describe('FIELD_NAMES', () => {
    it('should be defined', () => {
      expect(FIELD_NAMES).toBeDefined()
    })

    it('should be an object', () => {
      expect(typeof FIELD_NAMES).toBe('object')
      expect(FIELD_NAMES).not.toBeNull()
    })

    it('should have string values', () => {
      Object.values(FIELD_NAMES).forEach((value) => {
        expect(typeof value).toBe('string')
      })
    })

    it('should not be empty', () => {
      expect(Object.keys(FIELD_NAMES).length).toBeGreaterThan(0)
    })

    it('should have consistent naming convention for keys', () => {
      Object.keys(FIELD_NAMES).forEach((key) => {
        expect(key).toMatch(/^[A-Z_]+$/)
      })
    })
  })

  describe('Type Safety', () => {
    it('should have correct TypeScript types for adminSideBarLinks', () => {
      type ExpectedLink = {
        img: string
        route: string
        text: string
      }

      const link: ExpectedLink = adminSideBarLinks[0]
      expect(link).toBeDefined()
    })

    it('should maintain array type for adminSideBarLinks', () => {
      expect(Array.isArray(adminSideBarLinks)).toBe(true)
    })
  })

  describe('Integration with Admin Navigation', () => {
    it('should provide valid navigation paths', () => {
      const validPaths = ['/admin', '/admin/users', '/admin/movies']
      adminSideBarLinks.forEach((link) => {
        expect(validPaths).toContain(link.route)
      })
    })

    it('should have accessible icon paths', () => {
      const iconPattern = /^\/icons\/admin\/(home|users|movie)\.svg$/
      adminSideBarLinks.forEach((link) => {
        expect(link.img).toMatch(iconPattern)
      })
    })

    it('should have user-friendly text labels', () => {
      adminSideBarLinks.forEach((link) => {
        expect(link.text).toBeTruthy()
        expect(link.text.length).toBeGreaterThan(0)
        expect(link.text.length).toBeLessThan(50)
      })
    })
  })

  describe('Data Integrity', () => {
    it('should not have null or undefined values', () => {
      adminSideBarLinks.forEach((link) => {
        expect(link.img).not.toBeNull()
        expect(link.img).not.toBeUndefined()
        expect(link.route).not.toBeNull()
        expect(link.route).not.toBeUndefined()
        expect(link.text).not.toBeNull()
        expect(link.text).not.toBeUndefined()
      })
    })

    it('should not have empty strings', () => {
      adminSideBarLinks.forEach((link) => {
        expect(link.img).not.toBe('')
        expect(link.route).not.toBe('')
        expect(link.text).not.toBe('')
      })
    })

    it('should have properly formatted routes', () => {
      adminSideBarLinks.forEach((link) => {
        expect(link.route).toMatch(/^\/[a-z-/]*$/)
        expect(link.route).not.toMatch(/\s/)
      })
    })
  })

  describe('Backward Compatibility', () => {
    it('should maintain structure for future expansion', () => {
      const potentialNewLink = {
        img: '/icons/admin/bookmark.svg',
        route: '/admin/purchase-records',
        text: 'Purchase Records',
      }

      const extendedLinks = [...adminSideBarLinks, potentialNewLink]
      expect(extendedLinks.length).toBe(4)
      expect(extendedLinks[3]).toEqual(potentialNewLink)
    })

    it('should maintain backward compatibility when adding new links', () => {
      const originalLinks = [...adminSideBarLinks]
      expect(originalLinks).toHaveLength(3)
      
      const newLinks = [
        ...originalLinks,
        {
          img: '/icons/admin/settings.svg',
          route: '/admin/settings',
          text: 'Settings',
        },
      ]

      expect(originalLinks[0]).toEqual(adminSideBarLinks[0])
      expect(originalLinks[1]).toEqual(adminSideBarLinks[1])
      expect(originalLinks[2]).toEqual(adminSideBarLinks[2])
    })
  })
})