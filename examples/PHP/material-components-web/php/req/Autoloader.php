<?php
class Autoloader {
	private $namespaces = [];

	public function registerNamespaces(array $definition)	{
		$this->namespaces = $definition;
		return $this;
	}

	public function register()	{
		spl_autoload_register([$this, 'handle']);
	}

    private function endsWith($haystack, $needle) {
        $length = strlen($needle);
        if ($length == 0) {
            return true;
        }
        return (substr($haystack, -$length) === $needle);
    }

	/**
	 * Autoloading
	 * @param $name
	 */
	public function handle($name) {
        if(DIRECTORY_SEPARATOR === '/') {
          $name = str_replace('\\', DIRECTORY_SEPARATOR, $name);
        }
	
        $findNamespace = substr($name,0,strrpos($name, DIRECTORY_SEPARATOR));

        foreach($this->namespaces as $namespace) {
            if($this->endsWith($namespace,$findNamespace)) {
                $fileName = $namespace.DIRECTORY_SEPARATOR.substr($name,strrpos($name, DIRECTORY_SEPARATOR) + 1).'.php';

                if(file_exists($fileName)) {
                    require_once $fileName;
                } else {
                    error_log('Failes to load file: '.$fileName);
                }
            }
        }
	}
}
