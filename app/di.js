var di = function ($logger, $app, $dependencies, $options){
  for (var dependency in $dependencies) {
    $logger.info(JSON.stringify($dependencies));
    if ($dependencies.hasOwnProperty(dependency)){
      $logger.info(dependency);
    }
  }
};

module.exports = di;