SELECT ng_rest.create_company('ng_adventuresyndicate', json_build_object(
    'delete_if_exists', 'true',
    'tables', json_build_object(
        'json_store', json_build_object(
                'constraints', json_build_array(
                    json_build_object(
                        'name', 'json_store_pk',
                        'value', 'PRIMARY KEY (id)'
                    )
                )
        ),
        'binary_store', json_build_object(
            'constraints', json_build_array(
                json_build_object(
                    'name', 'binary_store_pk',
                    'value', 'PRIMARY KEY (binary_id)'
                )
            )
        ),
        'acl', json_build_object(
            'constraints', json_build_array(
                json_build_object('name', 'acl_pkey', 'value', 'PRIMARY KEY (acl_id)')
            )
        ),
        'workflow', json_build_object(
            'constraints', json_build_array(
                json_build_object(
                    'name', 'workflow_pkey',
                    'value', 'PRIMARY KEY (workflow_id)'
                )
            )
        ),
        'files', json_build_object(
            'constraints', json_build_array(
                json_build_object(
                    'name', 'files_pkey',
                    'value', 'PRIMARY KEY (file_id)'
                )
            )
        ),
        'file_records', json_build_object(
            'constraints', json_build_array(
                json_build_object(
                    'name', 'records_files_fkey',
                    'value', 'FOREIGN KEY (file_id) REFERENCES <schema>.files(file_id) MATCH SIMPLE ON UPDATE NO ACTION ON DELETE CASCADE'
                )
            )
        )
)));
