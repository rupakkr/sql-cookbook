const SQL_DATA = [
  {
    "id": "select-all",
    "title": "SELECT All",
    "category": "Basic",
    "description": "Retrieves all columns and rows from a table.",
    "snippets": [
      {
        "label": "Standard",
        "code": "SELECT * FROM table_name;"
      }
    ]
  },
  {
    "id": "select-distinct",
    "title": "SELECT Distinct",
    "category": "Basic",
    "description": "Retrieves only unique values from a column.",
    "snippets": [
      {
        "label": "Single Column",
        "code": "SELECT DISTINCT column_name FROM table_name;"
      }
    ]
  },
  {
    "id": "inner-join",
    "title": "Inner Join",
    "category": "Joins",
    "description": "Combines rows from two tables based on a related column.",
    "snippets": [
      {
        "label": "Basic Inner Join",
        "code": "SELECT A.col1, B.col2\nFROM TableA A\nINNER JOIN TableB B ON A.id = B.a_id;"
      }
    ]
  }
];
