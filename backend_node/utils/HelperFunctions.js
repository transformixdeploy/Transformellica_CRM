function generateDynamicCreateTableSql(tableName, userData, inferSqlTypeFunction) {
    if (!tableName) {
        throw new Error("Table name must be provided.");
    }
    if (!userData || userData.length === 0) {
        // If userData is empty, we can't infer schema. Return a basic table or throw an error.
        // For now, let's assume we need at least one row to infer.
        throw new Error("User data is empty, cannot infer schema for dynamic table creation.");
    }
  
    const columns = ['"id" SERIAL PRIMARY KEY'];
  
    const firstRow = userData[0];
    Object.keys(firstRow).forEach(feature => {
        // Sanitize feature name to be a valid SQL identifier
        const sanitizedFeature = feature.replace(/[^a-zA-Z0-9_]/g, '_');
        const sqlType = inferSqlTypeFunction(feature, userData); // Use the provided inference function
        columns.push(`"${sanitizedFeature}" ${sqlType} `); // Add inferred type
    });
  
    // Add standard timestamp columns
    columns.push('"createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP');
    columns.push('"updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP');
  
  
    return `CREATE TABLE IF NOT EXISTS "${tableName}" (\n    ${columns.join(',\n    ')}\n);`;
};

function inferSqlType (columnName, data) {
    let hasString = false;
    let hasNumber = false;
    let hasBoolean = false;
    let hasDate = false;

    for (const row of data) {
        const value = row[columnName];
        if (value === null || value === undefined || value === '') continue; // Ignore empty values for type inference

        if (typeof value === 'string') {
        hasString = true;
        if (!isNaN(Number(value)) && !isNaN(parseFloat(value))) {
            hasNumber = true;
        } else if (value.toLowerCase() === 'true' || value.toLowerCase() === 'false') {
            hasBoolean = true;
        } else if (!isNaN(new Date(value).getTime())) {
            hasDate = true;
        }
        } else if (typeof value === 'number') {
        hasNumber = true;
        } else if (typeof value === 'boolean') {
        hasBoolean = true;
        } else if (value instanceof Date) {
        hasDate = true;
        }
    }

    // Prioritize specific types if purely that type, otherwise broaden
    if (hasNumber && !hasString && !hasDate && !hasBoolean) return 'NUMERIC';
    if (hasDate && !hasString && !hasNumber && !hasBoolean) return 'TIMESTAMP WITH TIME ZONE';
    if (hasBoolean && !hasString && !hasNumber && !hasDate) return 'BOOLEAN';

    // If it's a mix or default to string
    if (hasString) return 'VARCHAR(255)'; // Default string length, adjust as needed for larger text
    if (hasNumber) return 'NUMERIC'; // Fallback to numeric
    if (hasBoolean) return 'BOOLEAN'; // Fallback to boolean
    if (hasDate) return 'TIMESTAMP WITH TIME ZONE'; // Fallback to date

    return 'VARCHAR(255)'; // Ultimate fallback
};

function generateDynamicInsertSql(tableName, userData) {
    if (!tableName) {
        throw new Error("Table name must be provided.");
    }
    if (!userData || userData.length === 0) {
        return ""; // No data to insert, return empty query or handle as an error
    }

    const firstRecord = userData[0];
    // Dynamically get column names from the first record's keys
    let columnNames = Object.keys(firstRecord);

    // Sanitize column names for SQL identifiers
    let sanitizedColumnNames = columnNames.map(name => `"${name.replace(/[^a-zA-Z0-9_]/g, '_')}"`);

    // Add standard timestamp columns to the column list
    sanitizedColumnNames.push('"createdAt"', '"updatedAt"');

    const valuesClauses = userData.map(record => {
        const values = columnNames.map(column => {
            const value = record[column];
            if (value === null || value === undefined || value === '') { // Also handle empty strings as NULL
                return 'NULL';
            } else if (typeof value === 'string') {
                // Escape single quotes within strings for SQL
                return `'${value.replace(/'/g, "''")}'`;
            } else if (typeof value === 'number' || typeof value === 'boolean') {
                return String(value);
            } else if (value instanceof Date) {
                return `'${value.toISOString()}'`; // Convert Date objects to ISO string for TIMESTAMP WITH TIME ZONE
            }
            // Fallback for any other types, treat as string
            return `'${String(value).replace(/'/g, "''")}'`;
        });
        // Append CURRENT_TIMESTAMP for createdAt and updatedAt directly into each row's values
        return `(${values.join(', ')}, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP)`;
    });

    return `INSERT INTO "${tableName}" (${sanitizedColumnNames.join(', ')})\nVALUES\n${valuesClauses.join(',\n')};`;
};

async function generatePaginatedDataQuery(sql, tableName, offset, limit) {
    if (!tableName) {
        console.log('Error: Table name missing');
        throw new Error("Table name must be provided.");
    }

    console.log('Starting generatePaginatedDataQuery', { tableName, offset, limit });

    // Query 1: Fetch column names
    console.log('Query 1: Fetching column names from information_schema.columns');
    const columnsData = await sql`SELECT column_name
        FROM information_schema.columns
        WHERE table_schema = 'public'
        AND table_name = ${tableName}
        ORDER BY ordinal_position`;
    console.log('Query 1 result:', columnsData);

    // Ensure columnsData is an array
    if (!Array.isArray(columnsData)) {
        console.log('Error: columnsData is not an array:', columnsData);
        throw new Error("Expected sql() to return an array of objects for column names.");
    }

    // Extract column names and filter out excluded ones
    const columnsToExclude = ['createdAt', 'updatedAt'];
    const desiredColumns = columnsData
        .map(row => row.column_name)
        .filter(col => !columnsToExclude.includes(col));
    console.log('Desired columns:', desiredColumns);

    if (desiredColumns.length === 0) {
        console.log('Error: No selectable columns found for table', tableName);
        throw new Error(`No selectable columns found for table "${tableName}" after exclusion.`);
    }

    // Sanitize column names
    const selectClause = desiredColumns.map(col => `"${col.replace(/[^a-zA-Z0-9_]/g, '_')}"`).join(', ');
    console.log('Generated SELECT clause:', selectClause);

    // Query 2: Count all records
    console.log('Query 2: Counting records in', tableName);
    const countQuery = `SELECT COUNT(*) FROM "${tableName}"`;
    console.log('Generated COUNT query:', countQuery);
    const countResult = await sql.query(countQuery); // Use sql() for raw query
    console.log('Query 2 result:', countResult);
    const count = Number(countResult[0].count); // Adjust based on actual result structure

    // Query 3: Fetch paginated records
    console.log('Query 3: Fetching paginated records');
    const rowsQuery = `
        SELECT ${selectClause}
        FROM "${tableName}"
        ORDER BY "id" ASC
        OFFSET ${offset}
        LIMIT ${limit}`;
    console.log('Generated ROWS query:', rowsQuery);
    const rows = await sql.query(rowsQuery); // Use sql() for raw query
    console.log('Query 3 result:', rows);

    return {
        count,
        rows
    };
};

export default{
    generateDynamicCreateTableSql,
    inferSqlType,
    generateDynamicInsertSql,
    generatePaginatedDataQuery
}