export function run(db, sql, params) {
  return new Promise(function (resolve, reject) {
    db.run(sql, params, function (error) {
      if (error) {
        reject(error);
      } else {
        resolve(this);
      }
    });
  });
}

export function get(db, sql, params) {
  return new Promise(function (resolve, reject) {
    db.get(sql, params, function (error, row) {
      if (error) {
        reject(error);
      } else {
        resolve(row);
      }
    });
  });
}

export function close(db) {
  return new Promise(function (resolve, reject) {
    db.close(function (error) {
      if (error) {
        reject(error);
      } else {
        resolve();
      }
    });
  });
}
