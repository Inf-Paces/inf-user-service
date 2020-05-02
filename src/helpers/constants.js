export const code404 = 404;
export const code500 = 500;
export const code200 = 200;
export const errorStatus = 'error';
export const successStatus = 'success';
export const routeNotFoundError = 'Not found';
export const internalServerError = 'Internal server error';
export const welcomeMessage = 'Welcome to Inf-paces user access management service';

// DB Queries
export const createOrganizationsTableQuery = `
  CREATE TABLE IF NOT EXISTS organizations (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    name VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    phone VARCHAR(11),
    address VARCHAR(150),
    city VARCHAR(50),
    state VARCHAR(50),
    address_description VARCHAR(250),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP,
    created_by BIGINT REFERENCES users (id),
    last_updated_by BIGINT REFERENCES users (id)
  );
`;

export const createUserRolesTypeQuery = `
  DO $$
  BEGIN
    IF NOT EXISTS (
      SELECT 1 FROM pg_type WHERE typname='user_roles'
    ) THEN CREATE TYPE user_roles AS ENUM (
      'admin', 'blogger', 'customer', 'super_admin', 'logistic_partner'
    );
    END IF;
  END $$;
`;

export const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    email VARCHAR(150) UNIQUE NOT NULL,
    password VARCHAR(250),
    phone VARCHAR(11) NOT NULL,
    address VARCHAR(150),
    city VARCHAR(50),
    state VARCHAR(50),
    address_description VARCHAR(250),
    role user_roles NOT NULL DEFAULT 'customer',
    activated BOOLEAN NOT NULL DEFAULT false,
    created_by BIGINT REFERENCES users (id),
    last_updated_by BIGINT REFERENCES users (id),
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMP
  );
`;

export const createUserOrgTable = `
  CREATE TABLE IF NOT EXISTS organization_users (
    id BIGSERIAL PRIMARY KEY NOT NULL,
    user_id BIGINT REFERENCES users (id) UNIQUE NOT NULL,
    organization_id BIGINT REFERENCES organizations (id) NOT NULL
  );
`;

export const createOrganizationFunctionQuery = `
  CREATE OR REPLACE FUNCTION create_organization(
    org_name TEXT, org_email TEXT, org_phone VARCHAR(11), org_address TEXT,
    org_city TEXT, org_state TEXT, org_address_desc TEXT, creator BIGINT,
    user_first_name TEXT, user_last_name TEXT, user_password TEXT,
    user_phone VARCHAR(11), user_address TEXT, user_city TEXT, user_state TEXT,
    user_address_desc TEXT, user_status BOOLEAN
  ) RETURNS TABLE (organization JSON, usr JSON) AS $$
  DECLARE org RECORD;
  DECLARE usr RECORD;
  BEGIN
    INSERT INTO organizations (
      name, email, phone, address, city, state, address_description, created_by
    ) VALUES (
      org_name, org_email, org_phone, org_address, org_city, org_state, org_address_desc, creator
    ) ON CONFLICT ON CONSTRAINT organizations_name_key DO UPDATE SET name=organizations.name RETURNING * INTO org;

    INSERT INTO users (
      first_name, last_name, email, password, phone, address,
      city, state, address_description, role, activated, created_by
    ) VALUES (
      user_first_name, user_last_name, org_email, user_password, user_phone, user_address,
      user_city, user_state, user_address_desc, 'super_admin', user_status, creator
    ) ON CONFLICT (email) DO UPDATE SET email=users.email
    RETURNING id, first_name, last_name, email, phone, address,
    city, state, address_description, role, activated INTO usr;

    INSERT INTO organization_users (
      user_id, organization_id
    ) VALUES (
      usr.id, org.id
    ) ON CONFLICT (user_id) DO NOTHING;
    RETURN QUERY SELECT row_to_json(org), row_to_json(usr);
  END;
  $$ LANGUAGE plpgsql;
`;

export const createInfPacesQuery = (
  orgName, orgEmail, orgPhone, orgAddress, orgCity, orgState, orgAddressDesc,
  creator, userFirstName, userLastName, userPassword, userPhone, userAddress,
  userCity, userState, userAddressDesc, userStatus,
) => [
  `SELECT organization, usr as user FROM create_organization(
    $1, $2, $3, $4, $5, $6, $7, $8, $9,
    $10, $11, $12, $13, $14, $15, $16, $17
  )`,
  [
    orgName, orgEmail, orgPhone, orgAddress, orgCity, orgState, orgAddressDesc,
    creator, userFirstName, userLastName, userPassword, userPhone, userAddress,
    userCity, userState, userAddressDesc, userStatus,
  ],
];

export const dropCreateOrgFunction = 'DROP FUNCTION IF EXISTS create_organization';
export const dropOrgUserTable = 'DROP TABLE IF EXISTS organization_users';
export const dropUsersTable = 'DROP TABLE IF EXISTS users;';
export const dropOrganizationsTable = 'DROP TABLE IF EXISTS organizations;';
export const dropUserRolesType = 'DROP TYPE IF EXISTS user_roles;';
