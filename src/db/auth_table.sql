create table if not exists auth(
    id serial primary key,
    encrypted_id text UNIQUE not null, -- Added UNIQUE here so it can be referenced
    email text not null,
    username text not null unique,
    role text not null,
    password text not null,
    phone_number text,
    is_verified boolean default false,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    verified_at timestamp default current_timestamp
);

create table if not exists administration_deans_dean(
    id serial primary key,
    Dean_Id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    responsibility text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists administration_deans_associatedean(
    id serial primary key,
    Associate_Dean_Id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    responsibility text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists administration_institutecordinator_cordinator(
    id serial primary key,
    cordinator_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    responsibility text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists administration_headofdepartments_headofdepartment(
    id serial primary key,
    head_of_department_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    designation text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists administration_facultyinchardge_incharge(
    id serial primary key,
    incharge_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    department  text not null,
    responsibility text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists administration_registraroffice_registrar(
    id serial primary key,
    registrar_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    responsibility text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists administration_registraroffice_officestaff(
    id serial primary key,
    officestaff_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    responsibility text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists departments_faculty(
    id serial primary key,
    faculty_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    department text not null,
    area_of_interest text not null,
    type text not null,
    view text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists departments_staff(
    id serial primary key,
    staff_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    department text not null,
    designation text not null,
    type text not null,
    view text,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists academics_functionaries(
    id serial primary key,
    faculty_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    responsibility text not null,
    type text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists student_functionaries(
    id serial primary key,
    faculty_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    responsibility text not null,
    type text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists faculty_functionaries(
    id serial primary key,
    faculty_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    responsibility text not null,
    type text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);

create table if not exists alumini_functionaries(
    id serial primary key,
    faculty_id text REFERENCES auth(encrypted_id) ON DELETE CASCADE, -- Changed to text
    responsibility text not null,
    type text not null,
    created_at timestamp default current_timestamp,
    updated_at timestamp default current_timestamp,
    encrypted_id text not null
);