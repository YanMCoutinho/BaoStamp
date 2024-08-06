// queries.ts

export const NOTICES_QUERY = `
  query notices {
    notices {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;

export const REPORTS_QUERY = `
  query reports {
    reports {
      edges {
        node {
          index
          input {
            index
          }
          payload
        }
      }
    }
  }
`;

export const VOUCHERS_QUERY = (index: Number) => {
return `query vouchers {
    vouchers {
      edges {
        node {
          index
          input {
            index
          }
          destination
          payload
        }
      }
    }
  }
`};