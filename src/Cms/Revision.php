<?php

namespace Kirby\Cms;

use Kirby\Blueprint\Blueprint;
use Kirby\Blueprint\Bools;
use Kirby\Data\Data;
use Kirby\Data\Yaml;
use Kirby\Exception\PermissionException;
use Kirby\Field\Fields;
use Kirby\Filesystem\Dir;
use Kirby\Filesystem\F;

/**
 * Model Revision
 *
 * @package   Kirby Cms
 * @author    Bastian Allgeier <bastian@getkirby.com>
 * @link      https://getkirby.com
 * @copyright Bastian Allgeier
 * @license   https://getkirby.com/license
 */
class Revision
{
	public Fields $fields;
	public bool $staged = false;
	public bool $pulled = false;

	public function __construct(
		public ModelWithContent $model,
	) {
		$this->fields = $this->model->blueprint()->fields();
	}

	public function changes(): array
	{
		$recent   = $this->read();
		$original = $this->original();
		$changes  = [];

		// don't compare the revision metadata
		unset($recent['revision']);

		foreach ($recent as $key => $value) {
			// the field does not exist yet
			if (isset($original[$key]) === false) {
				$changes[$key] = $value;
				continue;
			}

			// the value has changed
			if ($original[$key] !== $value) {
				$changes[$key] = $value;
			}
		}

		return $changes;
	}

	public function commit(?User $user = null): static
	{
		$user ??= App::instance()->user();

		if ($user === null) {
			throw new PermissionException('Only a logged in user can commit changes');
		}

		if ($this->isLocked($user) === true) {
			throw new PermissionException('The revision is locked and cannot be overwritten');
		}

		// nothing to commit
		if ($this->staged === false) {
			return $this;
		}

		$values = $this->fields->export()->toStrings();
		$values['revision'] = [
			'user' => $user->id(),
			'time' => date('Y-m-d H:i:s')
		];

		$this->write($values);
		$this->staged = false;

		return $this;
	}

	public function delete(): bool
	{
		$file = $this->file();
		$dir  = dirname($file);

		F::remove($file);

		if (Dir::isEmpty($dir) === true) {
			Dir::remove($dir);
		}

		return true;
	}

	public function discard(): static
	{
		$this->delete();
		return $this;
	}

	public function exists(): bool
	{
		return file_exists($this->file()) === true;
	}

	public function file(): string
	{
		return $this->model->root() . '/_revisions/revision.' . $this->model->contentFileExtension();
	}

	public function hasChanges(): bool
	{
		return empty($this->changes()) === false;
	}

	public function info(): array
	{
		$defaults = [
			'user' => null,
			'time' => null
		];

		if ($data = ($this->read()['revision'] ?? null)) {
			return array_merge($defaults, Yaml::decode($data));
		}

		return $defaults;
	}

	public function isLocked(User $user): bool
	{
		if ($this->exists() === false) {
			return false;
		}

		if ($this->user()->is($user) === true) {
			return false;
		}

		return true;
	}

	public function original(): array
	{
		return $this->model->content()->toArray();
	}

	public function pull(): static
	{
		$values = $this->read() ?? $this->original();

		$this->fields->fill($values);
		$this->pulled = true;
		return $this;
	}

	public function push(bool $force = false): static
	{
		if ($force === false) {
			$this->validate();
		}

		$this->model->save($this->fields->export()->toStrings());
		$this->delete();
		return $this;
	}

	public function read(): ?array
	{
		if ($this->exists() === true) {
			return Data::read($this->file());
		}

		return null;
	}

	public function stage(array $data): static
	{
		if ($this->pulled === false) {
			$this->pull();
		}

		$this->fields->fill($data);
		$this->staged = true;
		return $this;
	}

	public function strings(): array
	{
		return $this->fields->export()->toStrings();
	}

	public function timestamp(): ?int
	{
		if ($date = $this->info()['time']) {
			return strtotime($date);
		}

		return null;
	}

	public function user(): ?User
	{
		if ($userId = $this->info()['user']) {
			return App::instance()->user($userId);
		}

		return null;
	}

	public function validate(): bool
	{
		return $this->fields->validate();
	}

	public function value(string $id)
	{
		if ($this->pulled === false) {
			$this->pull();
		}

		return $this->values()[$id];
	}

	public function values(): array
	{
		return $this->fields->export()->toArray();
	}

	public function write(array $data): bool
	{
		return Data::write($this->file(), $data);
	}

}
